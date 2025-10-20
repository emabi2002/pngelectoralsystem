# 🗄️ Database Setup Instructions

**Database**: Supabase
**Project**: usipijjyqfpxmhjbebyo
**URL**: https://usipijjyqfpxmhjbebyo.supabase.co
**Status**: ⚠️ **TABLES NEED TO BE CREATED**

---

## ⚠️ IMPORTANT: You Need to Set Up the Database Tables!

Your Supabase project exists, but the **database tables are not created yet**. This is why some features might not work properly.

**Without these tables**:
- ❌ Registration will fail (no `voters` table)
- ❌ Census won't work (no `citizens`, `households` tables)
- ❌ Login won't work (no `user_profiles` table)
- ❌ Results can't be stored (no `polling_results` table)

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Open Supabase SQL Editor**

1. Go to: https://supabase.com/dashboard/project/usipijjyqfpxmhjbebyo/sql
2. Make sure you're logged in
3. Click **"+ New query"** button

---

### **Step 2: Run Main Database Schema**

**File Location**: `database/schema.sql` (in your project)

**What This Creates**:
- ✅ `voters` table (for voter registration)
- ✅ `polling_results` table (for election results)
- ✅ `citizens` table (for census data)
- ✅ `households` table (for household management)
- ✅ `household_members` table (for household member tracking)
- ✅ Row Level Security (RLS) policies
- ✅ Database indexes for performance
- ✅ Triggers for automated updates

**How to Run**:

1. **Option A: Copy from File**
   - Open the file: `png-digital-electoral-system/database/schema.sql`
   - Copy ALL the contents (277 lines)
   - Paste into Supabase SQL Editor
   - Click **"Run"** button

2. **Option B: I'll Show You the SQL**

   The schema file contains:
   ```sql
   -- Enable necessary extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";

   -- Create custom types
   CREATE TYPE user_role AS ENUM ('admin', 'polling_officer', 'observer');
   CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');

   -- Create voters table
   CREATE TABLE voters (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       full_name TEXT NOT NULL,
       nid_smart_id TEXT UNIQUE NOT NULL,
       date_of_birth DATE NOT NULL,
       gender gender_type NOT NULL,
       province TEXT NOT NULL,
       district TEXT NOT NULL,
       -- ... and many more fields
   );

   -- Create other tables...
   -- (277 lines total)
   ```

**Expected Result**:
```
✅ Success. No rows returned
```

---

### **Step 3: Run User Profiles Schema**

**File Location**: `database/user_profiles_schema.sql`

**What This Creates**:
- ✅ `user_profiles` table (for authentication)
- ✅ Role-based access control (RBAC)
- ✅ User roles: enumerator, supervisor, analyst, administrator
- ✅ RLS policies for security

**How to Run**:

1. Click **"+ New query"** again in Supabase
2. Open the file: `png-digital-electoral-system/database/user_profiles_schema.sql`
3. Copy ALL the contents
4. Paste into SQL Editor
5. Click **"Run"**

**Expected Result**:
```
✅ Success. No rows returned
```

---

### **Step 4: Create Demo User Accounts**

**File Location**: `database/create_demo_accounts.sql`

**What This Creates**:
- ✅ Demo Administrator account
- ✅ Demo Analyst account
- ✅ Demo Supervisor account
- ✅ Demo Enumerator account

**How to Run**:

1. Click **"+ New query"** again
2. Open file: `png-digital-electoral-system/database/create_demo_accounts.sql`
3. Copy and paste into SQL Editor
4. Click **"Run"**

**Demo Accounts Created**:
```
Email: admin@demo.pg         Password: demo123  Role: Administrator
Email: analyst@demo.pg       Password: demo123  Role: Analyst
Email: supervisor@demo.pg    Password: demo123  Role: Supervisor
Email: enumerator@demo.pg    Password: demo123  Role: Enumerator
```

---

## ✅ Verification: Check Tables Were Created

### **Method 1: Table Editor**

1. Go to: https://supabase.com/dashboard/project/usipijjyqfpxmhjbebyo/editor
2. Look for these tables in the left sidebar:
   - ✅ `voters`
   - ✅ `citizens`
   - ✅ `households`
   - ✅ `household_members`
   - ✅ `polling_results`
   - ✅ `user_profiles`

### **Method 2: SQL Query**

Run this query in SQL Editor:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Output**:
```
citizens
household_members
households
polling_results
user_profiles
voters
```

---

## 🧪 Test the Database

### **Test 1: Check User Profiles Table**

Run this query:
```sql
SELECT * FROM user_profiles;
```

**Expected**: Should show 4 demo users if you ran step 4

### **Test 2: Check Voters Table**

Run this query:
```sql
SELECT COUNT(*) FROM voters;
```

**Expected**: `0` (table is empty but exists)

### **Test 3: Try Inserting Test Data**

Run this query:
```sql
INSERT INTO citizens (
    full_name,
    date_of_birth,
    gender,
    province,
    district
) VALUES (
    'Test Citizen',
    '1990-01-01',
    'Male',
    'National Capital District',
    'Moresby North-East'
) RETURNING *;
```

**Expected**: Should return the inserted row with a generated ID

**Then delete the test**:
```sql
DELETE FROM citizens WHERE full_name = 'Test Citizen';
```

---

## 📊 Database Schema Overview

### **Tables Created**:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `voters` | Voter registration with biometrics | nid_smart_id, facial_image_url, fingerprint_data |
| `citizens` | Census population data | full_name, nid_number, household_id |
| `households` | Household management | household_number, province, district |
| `household_members` | Individual household members | citizen_id, household_id, relationship |
| `polling_results` | Election results | polling_station, votes_counted |
| `user_profiles` | System users & authentication | email, role, is_active |

### **Security Features**:

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Role-based access control** (enumerator, supervisor, analyst, admin)
- ✅ **Encrypted fields** for sensitive data
- ✅ **Audit trails** (created_by, updated_by, timestamps)
- ✅ **Data validation** (CHECK constraints)

---

## 🔐 Environment Variables (Already Set)

Your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://usipijjyqfpxmhjbebyo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:bzMt0O7zkpJ22ojj@db.usipijjyqfpxmhjbebyo.supabase.co:5432/postgres
```

**Status**: ✅ These are already configured in your project

---

## 🚨 Troubleshooting

### **Error: "relation does not exist"**

**Problem**: Table wasn't created
**Solution**: Run the schema.sql file again

### **Error: "permission denied"**

**Problem**: RLS policy blocking access
**Solution**: Make sure you're authenticated or using service role key for admin operations

### **Error: "duplicate key value"**

**Problem**: Trying to insert data with same unique ID
**Solution**: Let PostgreSQL auto-generate IDs (use DEFAULT for id fields)

### **Tables Don't Appear in Table Editor**

**Problem**: Schema file didn't run successfully
**Solution**:
1. Check for error messages in SQL Editor
2. Run queries one section at a time
3. Check Supabase logs for detailed errors

---

## 🎯 Next Steps After Database Setup

Once tables are created:

1. ✅ **Test Registration Page**
   - Go to: https://same-6yf918d9bnu-latest.netlify.app/register
   - Try registering a voter
   - Should save to `voters` table

2. ✅ **Test Login**
   - Go to: https://same-6yf918d9bnu-latest.netlify.app/login
   - Use: admin@demo.pg / demo123
   - Should authenticate successfully

3. ✅ **Test Census**
   - Go to: https://same-6yf918d9bnu-latest.netlify.app/census
   - Create a household
   - Should save to `households` table

4. ✅ **Verify Data in Supabase**
   - Go to Table Editor
   - Check that data appears in tables

---

## 📞 Support

**Supabase Dashboard**: https://supabase.com/dashboard/project/usipijjyqfpxmhjbebyo
**SQL Editor**: https://supabase.com/dashboard/project/usipijjyqfpxmhjbebyo/sql
**Table Editor**: https://supabase.com/dashboard/project/usipijjyqfpxmhjbebyo/editor
**Logs**: https://supabase.com/dashboard/project/usipijjyqfpxmhjbebyo/logs

**Supabase Documentation**: https://supabase.com/docs
**Supabase Support**: https://supabase.com/support

---

## ✅ Checklist

Before testing your application:

- [ ] Ran `schema.sql` in Supabase SQL Editor
- [ ] Ran `user_profiles_schema.sql` in Supabase SQL Editor
- [ ] Ran `create_demo_accounts.sql` (optional but recommended)
- [ ] Verified tables exist in Table Editor
- [ ] Tested inserting sample data
- [ ] Confirmed demo users can log in

**Once all checked**, your database is ready! ✅

---

## 🇵🇬 Summary

**What You Have**:
- ✅ Supabase project (you created this)
- ✅ Database credentials (you provided these)
- ✅ Environment variables configured

**What You Need to Do**:
- ⚠️ **Create database tables** (run the 3 SQL files)
- ⚠️ **Create demo users** (optional but helpful)
- ⚠️ **Test the application** (verify everything works)

**Time Required**: 5-10 minutes
**Difficulty**: Easy (just copy-paste SQL and click Run)

---

**Once you complete these steps, your entire PNG Digital Electoral System will be fully operational!** 🎉
