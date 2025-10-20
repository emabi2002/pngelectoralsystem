BEGIN;

CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Matching config (thresholds and weights per modality)
CREATE TABLE IF NOT EXISTS public.matching_config (
  modality TEXT PRIMARY KEY CHECK (modality IN ('Fingerprint','Face','Iris')),
  threshold NUMERIC NOT NULL DEFAULT 0.75,
  weight NUMERIC NOT NULL DEFAULT 0.33
);

INSERT INTO public.matching_config (modality, threshold, weight)
VALUES
  ('Fingerprint', 0.80, 0.34),
  ('Face', 0.75, 0.33),
  ('Iris', 0.85, 0.33)
ON CONFLICT (modality) DO NOTHING;

-- Helper to compute normalized similarity score using levenshtein distance
CREATE OR REPLACE FUNCTION public.compute_similarity(sample TEXT, template TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  len INTEGER;
  dist INTEGER;
  score NUMERIC;
BEGIN
  IF sample IS NULL OR template IS NULL THEN
    RETURN 0;
  END IF;
  len := GREATEST(LENGTH(sample), LENGTH(template));
  dist := levenshtein(sample, template);
  score := GREATEST(0, 1.0 - (dist::NUMERIC / NULLIF(len,0)));
  RETURN score;
END;
$$;

-- 1:1 Verification RPC
-- Inputs: modality, sample_template, nid_number, station_id, device_id
-- Output: match flag, score, capture_id
CREATE OR REPLACE FUNCTION public.verify_biometric(
  in_modality TEXT,
  in_sample TEXT,
  in_nid TEXT,
  in_station TEXT,
  in_device TEXT
)
RETURNS TABLE(match BOOLEAN, score NUMERIC, capture_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_key TEXT := 'BIOMETRIC_DEMO_KEY_2025';
  v_threshold NUMERIC := 0.75;
  v_best_score NUMERIC := 0;
  v_best_capture UUID := NULL;
  v_modality TEXT := in_modality;
  v_start TIMESTAMP := clock_timestamp();
BEGIN
  -- Threshold lookup
  SELECT threshold INTO v_threshold FROM public.matching_config WHERE modality = v_modality;
  IF v_threshold IS NULL THEN
    v_threshold := 0.75;
  END IF;

  -- Iterate templates by modality for the given NID
  IF v_modality = 'Fingerprint' THEN
    FOR capture_row IN
      SELECT f.capture_id, pgp_sym_decrypt(f.template_enc, v_key) AS tmpl
      FROM biometrics.fingerprints f
      JOIN biometrics.captures c ON c.id = f.capture_id
      WHERE c.nid_number = in_nid
    LOOP
      IF capture_row.tmpl IS NOT NULL THEN
        PERFORM 1;
        IF capture_row.tmpl IS NOT NULL THEN
          DECLARE s NUMERIC := public.compute_similarity(in_sample, capture_row.tmpl);
          IF s > v_best_score THEN
            v_best_score := s;
            v_best_capture := capture_row.capture_id;
          END IF;
        END IF;
      END IF;
    END LOOP;
  ELSIF v_modality = 'Face' THEN
    FOR capture_row IN
      SELECT ft.capture_id, pgp_sym_decrypt(ft.template_enc, v_key) AS tmpl
      FROM biometrics.face_templates ft
      JOIN biometrics.captures c ON c.id = ft.capture_id
      WHERE c.nid_number = in_nid
    LOOP
      IF capture_row.tmpl IS NOT NULL THEN
        DECLARE s NUMERIC := public.compute_similarity(in_sample, capture_row.tmpl);
        IF s > v_best_score THEN
          v_best_score := s;
          v_best_capture := capture_row.capture_id;
        END IF;
      END IF;
    END LOOP;
  ELSIF v_modality = 'Iris' THEN
    FOR capture_row IN
      SELECT it.capture_id, pgp_sym_decrypt(it.template_enc, v_key) AS tmpl
      FROM biometrics.iris_templates it
      JOIN biometrics.captures c ON c.id = it.capture_id
      WHERE c.nid_number = in_nid
    LOOP
      IF capture_row.tmpl IS NOT NULL THEN
        DECLARE s NUMERIC := public.compute_similarity(in_sample, capture_row.tmpl);
        IF s > v_best_score THEN
          v_best_score := s;
          v_best_capture := capture_row.capture_id;
        END IF;
      END IF;
    END LOOP;
  ELSE
    RAISE EXCEPTION 'Unsupported modality: %', v_modality;
  END IF;

  -- Log verification event
  INSERT INTO public.verification_events (subject_nid, capture_id, modality, score, match, device_id, station_id, decision_time_ms)
  VALUES (in_nid, v_best_capture, v_modality, v_best_score, (v_best_score >= v_threshold), in_device, in_station, EXTRACT(MILLISECOND FROM (clock_timestamp() - v_start))::INTEGER);

  match := v_best_score >= v_threshold;
  score := v_best_score;
  capture_id := v_best_capture;
  RETURN NEXT;
  RETURN;
END;
$$;

-- 1:N Identification RPC (best match across all captures with NID)
CREATE OR REPLACE FUNCTION public.identify_biometric(
  in_modality TEXT,
  in_sample TEXT
)
RETURNS TABLE(nid TEXT, score NUMERIC, capture_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_key TEXT := 'BIOMETRIC_DEMO_KEY_2025';
  v_best_score NUMERIC := 0;
  v_best_capture UUID := NULL;
  v_best_nid TEXT := NULL;
BEGIN
  IF in_modality = 'Fingerprint' THEN
    FOR rec IN
      SELECT c.nid_number AS nid, f.capture_id, pgp_sym_decrypt(f.template_enc, v_key) AS tmpl
      FROM biometrics.fingerprints f
      JOIN biometrics.captures c ON c.id = f.capture_id
      WHERE c.nid_number IS NOT NULL
    LOOP
      IF rec.tmpl IS NOT NULL THEN
        DECLARE s NUMERIC := public.compute_similarity(in_sample, rec.tmpl);
        IF s > v_best_score THEN
          v_best_score := s;
          v_best_capture := rec.capture_id;
          v_best_nid := rec.nid;
        END IF;
      END IF;
    END LOOP;
  ELSIF in_modality = 'Face' THEN
    FOR rec IN
      SELECT c.nid_number AS nid, ft.capture_id, pgp_sym_decrypt(ft.template_enc, v_key) AS tmpl
      FROM biometrics.face_templates ft
      JOIN biometrics.captures c ON c.id = ft.capture_id
      WHERE c.nid_number IS NOT NULL
    LOOP
      IF rec.tmpl IS NOT NULL THEN
        DECLARE s NUMERIC := public.compute_similarity(in_sample, rec.tmpl);
        IF s > v_best_score THEN
          v_best_score := s;
          v_best_capture := rec.capture_id;
          v_best_nid := rec.nid;
        END IF;
      END IF;
    END LOOP;
  ELSIF in_modality = 'Iris' THEN
    FOR rec IN
      SELECT c.nid_number AS nid, it.capture_id, pgp_sym_decrypt(it.template_enc, v_key) AS tmpl
      FROM biometrics.iris_templates it
      JOIN biometrics.captures c ON c.id = it.capture_id
      WHERE c.nid_number IS NOT NULL
    LOOP
      IF rec.tmpl IS NOT NULL THEN
        DECLARE s NUMERIC := public.compute_similarity(in_sample, rec.tmpl);
        IF s > v_best_score THEN
          v_best_score := s;
          v_best_capture := rec.capture_id;
          v_best_nid := rec.nid;
        END IF;
      END IF;
    END LOOP;
  ELSE
    RAISE EXCEPTION 'Unsupported modality: %', in_modality;
  END IF;

  nid := v_best_nid;
  score := v_best_score;
  capture_id := v_best_capture;
  RETURN NEXT;
  RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_biometric(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.identify_biometric(TEXT, TEXT) TO authenticated;

COMMIT;
