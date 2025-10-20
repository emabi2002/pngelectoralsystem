-- Electoral Roll Table
-- This table stores the official electoral roll for PNG elections
-- It integrates with PNG NID system and supports manual registrations

CREATE TABLE IF NOT EXISTS electoral_roll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Identification
  nid_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,

  -- Location
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  llg_ward TEXT NOT NULL,
  polling_station TEXT,

  -- Registration Details
  registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Biometric Data
  photo_url TEXT,
  fingerprint_data TEXT, -- Stored fingerprint template
  signature_data TEXT, -- Stored signature image

  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('active', 'inactive', 'deceased', 'suspended')) DEFAULT 'active',

  -- Data Source
  source TEXT CHECK (source IN ('png_nid', 'manual_registration')) NOT NULL,

  -- Audit
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  registered_by_user_id UUID REFERENCES user_profiles(id),

  -- Indexes for performance
  CONSTRAINT electoral_roll_nid_number_key UNIQUE (nid_number)
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_electoral_roll_nid_number ON electoral_roll(nid_number);
CREATE INDEX IF NOT EXISTS idx_electoral_roll_province ON electoral_roll(province);
CREATE INDEX IF NOT EXISTS idx_electoral_roll_district ON electoral_roll(district);
CREATE INDEX IF NOT EXISTS idx_electoral_roll_polling_station ON electoral_roll(polling_station);
CREATE INDEX IF NOT EXISTS idx_electoral_roll_status ON electoral_roll(status);
CREATE INDEX IF NOT EXISTS idx_electoral_roll_source ON electoral_roll(source);
CREATE INDEX IF NOT EXISTS idx_electoral_roll_registration_date ON electoral_roll(registration_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_electoral_roll_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_electoral_roll_updated_at
  BEFORE UPDATE ON electoral_roll
  FOR EACH ROW
  EXECUTE FUNCTION update_electoral_roll_updated_at();

-- Row Level Security (RLS)
ALTER TABLE electoral_roll ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all electoral roll records
CREATE POLICY "Anyone can read electoral roll" ON electoral_roll
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert new records
CREATE POLICY "Authenticated users can insert electoral roll" ON electoral_roll
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to update records
CREATE POLICY "Authenticated users can update electoral roll" ON electoral_roll
  FOR UPDATE
  USING (true);

-- Electoral Roll Statistics View
CREATE OR REPLACE VIEW electoral_roll_stats AS
SELECT
  province,
  district,
  COUNT(*) as total_voters,
  COUNT(*) FILTER (WHERE status = 'active') as active_voters,
  COUNT(*) FILTER (WHERE status = 'inactive') as inactive_voters,
  COUNT(*) FILTER (WHERE status = 'deceased') as deceased_voters,
  COUNT(*) FILTER (WHERE status = 'suspended') as suspended_voters,
  COUNT(*) FILTER (WHERE source = 'png_nid') as from_nid,
  COUNT(*) FILTER (WHERE source = 'manual_registration') as manual_registrations,
  COUNT(*) FILTER (WHERE is_verified = true) as verified_voters,
  COUNT(*) FILTER (WHERE gender = 'Male') as male_voters,
  COUNT(*) FILTER (WHERE gender = 'Female') as female_voters
FROM electoral_roll
GROUP BY province, district
ORDER BY province, district;

-- Comment on table
COMMENT ON TABLE electoral_roll IS 'Official electoral roll for PNG elections with PNG NID integration';
