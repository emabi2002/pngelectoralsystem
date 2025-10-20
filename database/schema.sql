-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'polling_officer', 'observer');
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');

-- Create tables
-- Voters table for biometric registration
CREATE TABLE voters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Personal Information
    full_name TEXT NOT NULL,
    nid_smart_id TEXT UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type NOT NULL,

    -- Location Information
    llg_ward TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    polling_station TEXT NOT NULL,

    -- Biometric Data (encrypted)
    facial_image_url TEXT,
    fingerprint_data TEXT, -- Encrypted fingerprint template
    signature_data TEXT,   -- Base64 encoded signature

    -- Verification Status
    is_verified BOOLEAN DEFAULT false,
    registration_officer_id UUID REFERENCES auth.users(id),

    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Polling Results table
CREATE TABLE polling_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Location Information
    polling_station TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,

    -- Vote Counts
    total_registered_voters INTEGER NOT NULL,
    total_votes_cast INTEGER NOT NULL,
    candidate_results JSONB NOT NULL, -- Store candidate vote counts

    -- Transmission Status
    polling_officer_id UUID REFERENCES auth.users(id) NOT NULL,
    is_transmitted BOOLEAN DEFAULT false,
    transmitted_at TIMESTAMP WITH TIME ZONE,

    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'observer',
    province TEXT,
    district TEXT,
    polling_station TEXT,

    is_active BOOLEAN DEFAULT true
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    user_id UUID REFERENCES auth.users(id) NOT NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET
);

-- Provinces and Districts reference table
CREATE TABLE administrative_divisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    llg_ward TEXT,
    polling_station TEXT,

    UNIQUE(province, district, llg_ward, polling_station)
);

-- Insert PNG provinces and sample districts
INSERT INTO administrative_divisions (province, district) VALUES
('Western', 'North Fly'),
('Western', 'South Fly'),
('Western', 'Middle Fly'),
('Gulf', 'Kerema'),
('Gulf', 'Kikori'),
('Central', 'Abau'),
('Central', 'Kairuku-Hiri'),
('Central', 'Rigo'),
('National Capital District', 'Moresby North-East'),
('National Capital District', 'Moresby North-West'),
('National Capital District', 'Moresby South'),
('Milne Bay', 'Alotau'),
('Milne Bay', 'Esa''ala'),
('Milne Bay', 'Samarai-Murua'),
('Oro', 'Ijivitari'),
('Oro', 'Sohe'),
('Southern Highlands', 'Koroba-Lake Kopiago'),
('Southern Highlands', 'Komo-Magarima'),
('Southern Highlands', 'Tari-Pori'),
('Western Highlands', 'Hagen'),
('Western Highlands', 'Mul-Baiyer'),
('Western Highlands', 'Tambul-Nebilyer'),
('Enga', 'Kompiam-Ambum'),
('Enga', 'Lagaip-Porgera'),
('Enga', 'Wabag'),
('Chimbu', 'Chuave'),
('Chimbu', 'Gumine'),
('Chimbu', 'Kerowagi'),
('Eastern Highlands', 'Daulo'),
('Eastern Highlands', 'Goroka'),
('Eastern Highlands', 'Henganofi'),
('Morobe', 'Bulolo'),
('Morobe', 'Finschhafen'),
('Morobe', 'Huon Gulf'),
('Madang', 'Bogia'),
('Madang', 'Madang'),
('Madang', 'Middle Ramu'),
('East Sepik', 'Ambunti-Drekikier'),
('East Sepik', 'Angoram'),
('East Sepik', 'Maprik'),
('Sandaun', 'Aitape-Lumi'),
('Sandaun', 'Telefomin'),
('Sandaun', 'Vanimo-Green River'),
('Manus', 'Manus'),
('New Ireland', 'Kavieng'),
('New Ireland', 'Namatanai'),
('East New Britain', 'Gazelle'),
('East New Britain', 'Kokopo'),
('East New Britain', 'Pomio'),
('West New Britain', 'Kandrian-Gloucester'),
('West New Britain', 'Talasea'),
('Bougainville', 'Bougainville');

-- Create indexes for better performance
CREATE INDEX idx_voters_nid ON voters(nid_smart_id);
CREATE INDEX idx_voters_province ON voters(province);
CREATE INDEX idx_voters_district ON voters(district);
CREATE INDEX idx_voters_polling_station ON voters(polling_station);
CREATE INDEX idx_polling_results_station ON polling_results(polling_station);
CREATE INDEX idx_polling_results_province ON polling_results(province);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voters_updated_at BEFORE UPDATE ON voters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polling_results_updated_at BEFORE UPDATE ON polling_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id::text, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id::text, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
CREATE TRIGGER voters_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON voters
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER polling_results_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON polling_results
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Row Level Security (RLS) policies
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE polling_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Voters table policies
CREATE POLICY "Voters visible to authenticated users" ON voters
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Voters insertable by polling officers and admins" ON voters
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'polling_officer')
        )
    );

CREATE POLICY "Voters updatable by polling officers and admins" ON voters
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'polling_officer')
        )
    );

-- Polling results policies
CREATE POLICY "Polling results visible to authenticated users" ON polling_results
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Polling results insertable by polling officers and admins" ON polling_results
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'polling_officer')
        )
    );

-- User profiles policies
CREATE POLICY "User profiles visible to authenticated users" ON user_profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Audit logs policies (read-only for admins)
CREATE POLICY "Audit logs visible to admins only" ON audit_logs
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Citizens table (PNG NID replica with local enrollment)
CREATE TABLE IF NOT EXISTS citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    nid_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male','Female','Other')),
    place_of_birth TEXT,
    nationality TEXT,
    residential_address TEXT,
    postal_address TEXT,
    phone_number TEXT,
    email TEXT,
    marital_status TEXT,
    occupation TEXT,
    education_level TEXT,
    next_of_kin TEXT,
    next_of_kin_contact TEXT,

    issue_date DATE,
    expiry_date DATE,
    issuing_authority TEXT,

    photo_url TEXT,
    fingerprint_template TEXT,
    signature_template TEXT,

    status TEXT NOT NULL CHECK (status IN ('active','suspended','expired','revoked')) DEFAULT 'active',

    province TEXT,
    district TEXT,
    llg_ward TEXT,

    data_source TEXT NOT NULL CHECK (data_source IN ('png_nid','electoral_system')) DEFAULT 'electoral_system',
    is_synced_with_nid BOOLEAN DEFAULT false,
    created_by_officer_id TEXT,
    verification_status TEXT CHECK (verification_status IN ('pending','verified','rejected')) DEFAULT 'pending'
);

-- Indexes for citizens
CREATE INDEX IF NOT EXISTS idx_citizens_nid ON citizens(nid_number);
CREATE INDEX IF NOT EXISTS idx_citizens_name ON citizens(full_name);
CREATE INDEX IF NOT EXISTS idx_citizens_province ON citizens(province);

-- Enable RLS
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;

-- Policies for citizens
CREATE POLICY IF NOT EXISTS "Citizens visible to authenticated users" ON citizens
    FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Citizens insertable by authenticated users" ON citizens
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Citizens updatable by admins" ON citizens
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('administrator','admin')
        )
    );

-- Audit trigger for citizens
CREATE TRIGGER citizens_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON citizens
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Results transmissions table (store-and-forward receipts, multi-path metadata)
CREATE TABLE IF NOT EXISTS transmissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    polling_result_id UUID REFERENCES polling_results(id) ON DELETE SET NULL,
    polling_station TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,

    path TEXT NOT NULL, -- 'IP' | 'USSD' | 'SMS' | 'HF' | 'VHF'
    status TEXT NOT NULL DEFAULT 'sent', -- 'queued' | 'sent' | 'acked' | 'failed'
    attempts INTEGER NOT NULL DEFAULT 1,
    payload_hash TEXT NOT NULL,
    receipt TEXT,
    packets TEXT[], -- optional SMS/USSD chunks
    error_text TEXT
);

-- Indexes for transmissions
CREATE INDEX IF NOT EXISTS idx_transmissions_station ON transmissions(polling_station);
CREATE INDEX IF NOT EXISTS idx_transmissions_province ON transmissions(province);
CREATE INDEX IF NOT EXISTS idx_transmissions_created ON transmissions(created_at);

-- Enable RLS
ALTER TABLE transmissions ENABLE ROW LEVEL SECURITY;

-- Policies for transmissions
CREATE POLICY IF NOT EXISTS "Transmissions visible to authenticated users" ON transmissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Transmissions insertable by polling officers and admins" ON transmissions
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'polling_officer')
        )
    );

-- Audit trigger for transmissions
CREATE TRIGGER transmissions_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON transmissions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
