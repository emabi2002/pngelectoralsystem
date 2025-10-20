-- User Profiles Table for Authentication and Authorization
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('enumerator', 'supervisor', 'analyst', 'administrator')),
  province TEXT,
  district TEXT,
  enumeration_area TEXT,
  phone_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_enumeration_area ON user_profiles(enumeration_area);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role and is_active)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Administrators can view all profiles
CREATE POLICY "Administrators can view all profiles"
  ON user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'administrator' AND is_active = true
    )
  );

-- Administrators can create new users
CREATE POLICY "Administrators can create users"
  ON user_profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'administrator' AND is_active = true
    )
  );

-- Administrators can update any profile
CREATE POLICY "Administrators can update any profile"
  ON user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'administrator' AND is_active = true
    )
  );

-- Supervisors can view profiles in their province
CREATE POLICY "Supervisors can view province profiles"
  ON user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'supervisor'
        AND up.is_active = true
        AND up.province = user_profiles.province
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert demo accounts (password: demo123)
-- Note: These users need to be created via Supabase Auth first
-- This is a reference for the demo accounts

/*
Demo Accounts to Create via Supabase Auth:

1. Enumerator:
   Email: enumerator@demo.pg
   Password: demo123
   Profile: {
     full_name: 'Demo Enumerator',
     role: 'enumerator',
     province: 'National Capital District',
     district: 'Moresby North-East',
     enumeration_area: 'EA-NCD-001',
     phone_number: '+675 72345601'
   }

2. Supervisor:
   Email: supervisor@demo.pg
   Password: demo123
   Profile: {
     full_name: 'Demo Supervisor',
     role: 'supervisor',
     province: 'National Capital District',
     district: 'Moresby North-East',
     phone_number: '+675 72345602'
   }

3. Analyst:
   Email: analyst@demo.pg
   Password: demo123
   Profile: {
     full_name: 'Demo Analyst',
     role: 'analyst',
     phone_number: '+675 72345603'
   }

4. Administrator:
   Email: admin@demo.pg
   Password: demo123
   Profile: {
     full_name: 'Demo Administrator',
     role: 'administrator',
     phone_number: '+675 72345604'
   }
*/

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;
