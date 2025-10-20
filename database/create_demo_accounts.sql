-- =====================================================
-- PNG Digital Electoral System - Demo Account Setup
-- Run this script in Supabase SQL Editor
-- =====================================================

-- Step 1: Create user_profiles table if it doesn't exist
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Administrators can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Administrators can create users" ON user_profiles;
DROP POLICY IF EXISTS "Administrators can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Supervisors can view province profiles" ON user_profiles;

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

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;

-- =====================================================
-- IMPORTANT: Demo User Creation Instructions
-- =====================================================

/*
STEP 1: Create Auth Users in Supabase Dashboard
------------------------------------------------
Go to: Authentication → Users → Add User

Create these 4 users (one by one):

1. Enumerator Account:
   Email: enumerator@demo.pg
   Password: demo123
   Auto Confirm Email: YES

2. Supervisor Account:
   Email: supervisor@demo.pg
   Password: demo123
   Auto Confirm Email: YES

3. Analyst Account:
   Email: analyst@demo.pg
   Password: demo123
   Auto Confirm Email: YES

4. Administrator Account:
   Email: admin@demo.pg
   Password: demo123
   Auto Confirm Email: YES

STEP 2: After creating all 4 auth users, get their UUIDs
---------------------------------------------------------
Run this query to see the user IDs:

SELECT id, email FROM auth.users
WHERE email IN (
  'enumerator@demo.pg',
  'supervisor@demo.pg',
  'analyst@demo.pg',
  'admin@demo.pg'
)
ORDER BY email;

Copy the UUIDs and use them in STEP 3 below.

STEP 3: Create User Profiles
-----------------------------
Replace 'USER_ID_HERE' with the actual UUIDs from STEP 2:
*/

-- Enumerator Profile (replace USER_ID with actual UUID)
INSERT INTO user_profiles (id, email, full_name, role, province, district, enumeration_area, phone_number, is_active)
VALUES (
  'REPLACE_WITH_ENUMERATOR_UUID'::uuid,
  'enumerator@demo.pg',
  'Demo Enumerator',
  'enumerator',
  'National Capital District',
  'Moresby North-East',
  'EA-NCD-001',
  '+675 72345601',
  true
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  province = EXCLUDED.province,
  district = EXCLUDED.district,
  enumeration_area = EXCLUDED.enumeration_area,
  phone_number = EXCLUDED.phone_number,
  is_active = EXCLUDED.is_active;

-- Supervisor Profile
INSERT INTO user_profiles (id, email, full_name, role, province, district, phone_number, is_active)
VALUES (
  'REPLACE_WITH_SUPERVISOR_UUID'::uuid,
  'supervisor@demo.pg',
  'Demo Supervisor',
  'supervisor',
  'National Capital District',
  'Moresby North-East',
  '+675 72345602',
  true
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  province = EXCLUDED.province,
  district = EXCLUDED.district,
  phone_number = EXCLUDED.phone_number,
  is_active = EXCLUDED.is_active;

-- Analyst Profile
INSERT INTO user_profiles (id, email, full_name, role, phone_number, is_active)
VALUES (
  'REPLACE_WITH_ANALYST_UUID'::uuid,
  'analyst@demo.pg',
  'Demo Analyst',
  'analyst',
  '+675 72345603',
  true
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone_number = EXCLUDED.phone_number,
  is_active = EXCLUDED.is_active;

-- Administrator Profile
INSERT INTO user_profiles (id, email, full_name, role, phone_number, is_active)
VALUES (
  'REPLACE_WITH_ADMINISTRATOR_UUID'::uuid,
  'admin@demo.pg',
  'Demo Administrator',
  'administrator',
  '+675 72345604',
  true
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone_number = EXCLUDED.phone_number,
  is_active = EXCLUDED.is_active;

-- =====================================================
-- STEP 4: Verify Demo Accounts Created Successfully
-- =====================================================

-- Run this query to verify all profiles exist:
SELECT
  up.email,
  up.full_name,
  up.role,
  up.province,
  up.district,
  up.enumeration_area,
  up.is_active,
  up.created_at
FROM user_profiles up
WHERE up.email IN (
  'enumerator@demo.pg',
  'supervisor@demo.pg',
  'analyst@demo.pg',
  'admin@demo.pg'
)
ORDER BY
  CASE up.role
    WHEN 'administrator' THEN 1
    WHEN 'analyst' THEN 2
    WHEN 'supervisor' THEN 3
    WHEN 'enumerator' THEN 4
  END;

-- Expected output: 4 rows showing all demo accounts

-- =====================================================
-- Demo Account Credentials Summary
-- =====================================================

/*
DEMO ACCOUNTS CREATED:

Role: Administrator
Email: admin@demo.pg
Password: demo123
Access: Full system access

Role: Analyst
Email: analyst@demo.pg
Password: demo123
Access: Census dashboard, data visualization, reports

Role: Supervisor
Email: supervisor@demo.pg
Password: demo123
Access: Census monitoring, household management
Province: National Capital District

Role: Enumerator
Email: enumerator@demo.pg
Password: demo123
Access: Enumerator app, household/population registration
EA: EA-NCD-001

NEXT STEPS:
1. Test login for each account at /login
2. Verify role-based redirects work correctly
3. Test route protection (enumerator can't access admin routes, etc.)
4. Ready for workshop demonstration!
*/
