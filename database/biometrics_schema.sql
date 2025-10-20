-- Biometrics secure schema and functions (additive)

BEGIN;

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Secure schema for biometric templates
CREATE SCHEMA IF NOT EXISTS biometrics;
REVOKE ALL ON SCHEMA biometrics FROM PUBLIC;
GRANT USAGE ON SCHEMA biometrics TO postgres, service_role;

-- Capture sessions
CREATE TABLE IF NOT EXISTS biometrics.captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  rid TEXT, -- Registration ID if NID absent
  nid_number TEXT, -- when present
  person_id UUID, -- optional link to internal person
  enumerator_id UUID,
  kit_id TEXT,
  liveness_pass BOOLEAN DEFAULT false,
  notes TEXT
);

-- Fingerprints: per finger
CREATE TABLE IF NOT EXISTS biometrics.fingerprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capture_id UUID NOT NULL REFERENCES biometrics.captures(id) ON DELETE CASCADE,
  hand TEXT NOT NULL CHECK (hand IN ('Left','Right')),
  finger TEXT NOT NULL CHECK (finger IN ('Thumb','Index','Middle','Ring','Little')),
  quality INTEGER,
  missing BOOLEAN DEFAULT false,
  template_enc BYTEA NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fp_capture ON biometrics.fingerprints(capture_id);

-- Face templates
CREATE TABLE IF NOT EXISTS biometrics.face_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capture_id UUID NOT NULL REFERENCES biometrics.captures(id) ON DELETE CASCADE,
  image_url TEXT,
  quality INTEGER,
  template_enc BYTEA NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_face_capture ON biometrics.face_templates(capture_id);

-- Iris/retina templates
CREATE TABLE IF NOT EXISTS biometrics.iris_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capture_id UUID NOT NULL REFERENCES biometrics.captures(id) ON DELETE CASCADE,
  eye TEXT NOT NULL CHECK (eye IN ('Left','Right')),
  quality INTEGER,
  template_enc BYTEA NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_iris_capture ON biometrics.iris_templates(capture_id);

-- Public verification events (RLS-enabled)
CREATE TABLE IF NOT EXISTS public.verification_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  subject_nid TEXT,
  capture_id UUID,
  modality TEXT NOT NULL CHECK (modality IN ('Fingerprint','Face','Iris')),
  score NUMERIC,
  match BOOLEAN,
  device_id TEXT,
  station_id TEXT,
  decision_time_ms INTEGER,
  notes TEXT
);

ALTER TABLE public.verification_events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Verification visible to authenticated" ON public.verification_events
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Verification insertable by authenticated" ON public.verification_events
    FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RPC to store biometric capture packets securely
CREATE OR REPLACE FUNCTION public.store_biometric_packet(payload JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_capture_id UUID;
  v_key TEXT := 'BIOMETRIC_DEMO_KEY_2025'; -- Replace with KMS/HSM in production
BEGIN
  INSERT INTO biometrics.captures (rid, nid_number, person_id, enumerator_id, kit_id, liveness_pass, notes)
  VALUES (
    payload->>'rid',
    payload->>'nid_number',
    NULL,
    NULL,
    payload->>'kit_id',
    COALESCE((payload->>'liveness_pass')::BOOLEAN, false),
    payload->>'notes'
  ) RETURNING id INTO v_capture_id;

  -- Fingerprints array
  INSERT INTO biometrics.fingerprints (capture_id, hand, finger, quality, missing, template_enc)
  SELECT v_capture_id,
         (fp->>'hand'),
         (fp->>'finger'),
         NULLIF(fp->>'quality','')::INTEGER,
         COALESCE((fp->>'missing')::BOOLEAN, false),
         pgp_sym_encrypt(COALESCE(fp->>'template',''), v_key)
  FROM jsonb_array_elements(COALESCE(payload->'fingerprints','[]'::jsonb)) AS fp;

  -- Face (single)
  IF (payload ? 'face') THEN
    INSERT INTO biometrics.face_templates (capture_id, image_url, quality, template_enc)
    VALUES (
      v_capture_id,
      payload->'face'->>'image_url',
      NULLIF(payload->'face'->>'quality','')::INTEGER,
      pgp_sym_encrypt(COALESCE(payload->'face'->>'template',''), v_key)
    );
  END IF;

  -- Iris (array)
  INSERT INTO biometrics.iris_templates (capture_id, eye, quality, template_enc)
  SELECT v_capture_id,
         (ir->>'eye'),
         NULLIF(ir->>'quality','')::INTEGER,
         pgp_sym_encrypt(COALESCE(ir->>'template',''), v_key)
  FROM jsonb_array_elements(COALESCE(payload->'iris','[]'::jsonb)) AS ir;

  RETURN v_capture_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.store_biometric_packet(JSONB) TO authenticated;

COMMIT;
