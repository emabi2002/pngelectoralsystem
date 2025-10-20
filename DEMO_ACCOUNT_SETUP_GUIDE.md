# Demo Account Setup Guide
## PNG Digital Electoral System

**Quick Setup for Workshop - October 13-15, 2025**

---

## 🎯 Overview

This guide will help you create the 4 demo user accounts needed for the workshop demonstration.

**Time Required**: 15 minutes
**Prerequisites**: Access to Supabase Dashboard

---

## 📋 Demo Accounts to Create

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Administrator** | admin@demo.pg | demo123 | Full system access |
| **Analyst** | analyst@demo.pg | demo123 | Data visualization, reports |
| **Supervisor** | supervisor@demo.pg | demo123 | Monitoring, quality control |
| **Enumerator** | enumerator@demo.pg | demo123 | Field enumeration |

---

## 🚀 Setup Steps

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: **usipijjyqfpxmhjbebyo**
4. Navigate to: **SQL Editor** (left sidebar)

### Step 2: Create User Profiles Table

1. In SQL Editor, click **New Query**
2. Copy the contents of `database/create_demo_accounts.sql` (first part - table creation)
3. Paste into the SQL editor
4. Click **Run** (or press Ctrl+Enter)
5. Verify: "Success. No rows returned" message

**What this does**: Creates the `user_profiles` table with Row-Level Security policies

### Step 3: Create Auth Users

1. Navigate to: **Authentication** → **Users** (left sidebar)
2. Click **Add User** button (top right)

**For Each of the 4 Accounts, Repeat:**

#### Account 1: Administrator
- **Email**: `admin@demo.pg`
- **Password**: `demo123`
- **Auto Confirm Email**: ✅ **YES** (important!)
- Click **Create User**
- ✅ Note the UUID shown (you'll need this)

#### Account 2: Analyst
- **Email**: `analyst@demo.pg`
- **Password**: `demo123`
- **Auto Confirm Email**: ✅ **YES**
- Click **Create User**
- ✅ Note the UUID

#### Account 3: Supervisor
- **Email**: `supervisor@demo.pg`
- **Password**: `demo123`
- **Auto Confirm Email**: ✅ **YES**
- Click **Create User**
- ✅ Note the UUID

#### Account 4: Enumerator
- **Email**: `enumerator@demo.pg`
- **Password**: `demo123`
- **Auto Confirm Email**: ✅ **YES**
- Click **Create User**
- ✅ Note the UUID

### Step 4: Get User UUIDs

1. Go back to **SQL Editor**
2. Run this query:

```sql
SELECT id, email
FROM auth.users
WHERE email IN (
  'enumerator@demo.pg',
  'supervisor@demo.pg',
  'analyst@demo.pg',
  'admin@demo.pg'
)
ORDER BY email;
```

3. **Copy all 4 UUIDs** - you'll need them for the next step

**Expected Output**:
```
id                                    | email
--------------------------------------|-------------------
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | admin@demo.pg
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | analyst@demo.pg
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | enumerator@demo.pg
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | supervisor@demo.pg
```

### Step 5: Create User Profiles

1. Still in **SQL Editor**, create a new query
2. Copy the INSERT statements from `database/create_demo_accounts.sql` (Step 3 section)
3. **Replace each `REPLACE_WITH_XXX_UUID`** with the actual UUIDs from Step 4:
   - `REPLACE_WITH_ENUMERATOR_UUID` → UUID for enumerator@demo.pg
   - `REPLACE_WITH_SUPERVISOR_UUID` → UUID for supervisor@demo.pg
   - `REPLACE_WITH_ANALYST_UUID` → UUID for analyst@demo.pg
   - `REPLACE_WITH_ADMINISTRATOR_UUID` → UUID for admin@demo.pg

**Example**:
```sql
-- Before:
INSERT INTO user_profiles (id, email, full_name, role, ...)
VALUES (
  'REPLACE_WITH_ADMINISTRATOR_UUID'::uuid,
  'admin@demo.pg',
  ...

-- After (with actual UUID):
INSERT INTO user_profiles (id, email, full_name, role, ...)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'admin@demo.pg',
  ...
```

4. Run all 4 INSERT statements together
5. Verify: "Success. 4 rows affected" or similar

### Step 6: Verify Accounts Created

Run this verification query:

```sql
SELECT
  up.email,
  up.full_name,
  up.role,
  up.province,
  up.is_active
FROM user_profiles up
WHERE up.email IN (
  'enumerator@demo.pg',
  'supervisor@demo.pg',
  'analyst@demo.pg',
  'admin@demo.pg'
)
ORDER BY up.role;
```

**Expected Output**: 4 rows showing all demo accounts

```
email               | full_name          | role          | province                     | is_active
--------------------|-------------------|---------------|------------------------------|----------
admin@demo.pg       | Demo Administrator | administrator | null                         | true
analyst@demo.pg     | Demo Analyst       | analyst       | null                         | true
supervisor@demo.pg  | Demo Supervisor    | supervisor    | National Capital District    | true
enumerator@demo.pg  | Demo Enumerator    | enumerator    | National Capital District    | true
```

---

## ✅ Test Demo Accounts

### Test Login for Each Account

1. Open the system: **https://same-6yf918d9bnu-latest.netlify.app**
2. Navigate to `/login`
3. Test each account:

#### Test 1: Administrator Login
- Email: `admin@demo.pg`
- Password: `demo123`
- Click **Sign In**
- ✅ **Expected**: Redirect to `/` (main dashboard)
- ✅ **Expected**: Can access all routes

#### Test 2: Analyst Login
- Logout (if logged in)
- Email: `analyst@demo.pg`
- Password: `demo123`
- Click **Sign In**
- ✅ **Expected**: Redirect to `/census-dashboard`
- ✅ **Expected**: Can view dashboards, cannot edit data

#### Test 3: Supervisor Login
- Logout
- Email: `supervisor@demo.pg`
- Password: `demo123`
- Click **Sign In**
- ✅ **Expected**: Redirect to `/census-monitoring`
- ✅ **Expected**: Can access monitoring and household management

#### Test 4: Enumerator Login
- Logout
- Email: `enumerator@demo.pg`
- Password: `demo123`
- Click **Sign In**
- ✅ **Expected**: Redirect to `/enumerator`
- ✅ **Expected**: Can access enumerator app and registration

---

## 🔒 Security Verification

### Test Route Protection

**Logged in as Enumerator**, try to access:
- `/census-monitoring` → ✅ Should redirect to `/enumerator`
- `/census-dashboard` → ✅ Should redirect to `/enumerator`
- Administrator routes → ✅ Should redirect to `/enumerator`

**Logged in as Supervisor**, try to access:
- `/enumerator` → ✅ Should have access
- `/census-dashboard` → ✅ Should be blocked
- Administrator routes → ✅ Should be blocked

**Logged in as Analyst**, try to access:
- `/census-dashboard` → ✅ Should have access (read-only)
- `/household-management` → ✅ Can view, cannot edit
- Enumerator routes → ✅ Should be blocked

**Logged in as Administrator**:
- All routes → ✅ Should have full access

---

## 🐛 Troubleshooting

### Problem: "Invalid login credentials"
**Solution**:
1. Verify email is correct (check for typos)
2. Verify password is exactly `demo123`
3. Check if "Auto Confirm Email" was set to YES
4. Try resetting password in Supabase dashboard

### Problem: User redirects to wrong page
**Solution**:
1. Check user profile role in database
2. Verify middleware.ts is deployed
3. Clear browser cache and cookies
4. Try in incognito/private window

### Problem: "Account inactive" error
**Solution**:
```sql
UPDATE user_profiles
SET is_active = true
WHERE email = 'xxx@demo.pg';
```

### Problem: RLS policies blocking access
**Solution**:
1. Verify RLS policies were created (run Step 2 again)
2. Check user has correct role in user_profiles table
3. Verify auth.uid() matches user_profiles.id

### Problem: User profile not found
**Solution**:
1. Verify user exists in `auth.users`
2. Verify user profile exists in `user_profiles`
3. Make sure UUIDs match between auth.users and user_profiles
4. Re-run INSERT statements from Step 5

---

## 📋 Quick Checklist

Before the workshop, verify:

- [ ] All 4 auth users created in Supabase
- [ ] All 4 user profiles created in user_profiles table
- [ ] All 4 accounts can login successfully
- [ ] Role-based redirects work correctly
- [ ] Route protection prevents unauthorized access
- [ ] Each role can access their designated features
- [ ] Demo data populated in database (households, population)
- [ ] All user guides printed and ready
- [ ] Workshop presentation tested

---

## 🎯 Ready for Workshop!

Once all accounts are created and tested, you're ready for the workshop demonstration.

**Demo Account Summary** (for attendees):

```
========================================
PNG Electoral Commission Workshop
Demo Account Credentials
========================================

ADMINISTRATOR:
  Email: admin@demo.pg
  Password: demo123

ANALYST:
  Email: analyst@demo.pg
  Password: demo123

SUPERVISOR:
  Email: supervisor@demo.pg
  Password: demo123

ENUMERATOR:
  Email: enumerator@demo.pg
  Password: demo123

========================================
System URL:
https://same-6yf918d9bnu-latest.netlify.app
========================================
```

---

## 📞 Support

**Technical Issues**: support@same.new
**Workshop Questions**: [Workshop Coordinator]

---

**Setup Time**: ~15 minutes
**Last Updated**: October 10, 2025
**Version**: 1.0

**🇵🇬 Ready to demonstrate PNG's digital electoral transformation!**
