# PNG Digital Electoral System - Setup Guide
## Complete Installation and Configuration

**Version**: 12 (Production Ready)
**Last Updated**: October 10, 2025

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [ ] **Node.js 20+** installed ([Download](https://nodejs.org/))
- [ ] **Bun** installed (recommended) or npm ([Install Bun](https://bun.sh/))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Supabase Account** ([Sign up](https://supabase.com/))
- [ ] **GitHub Account** (to clone repository)
- [ ] **PostgreSQL client** (optional, for direct database access)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/emabi2002/pngelectoralsystem.git
cd pngelectoralsystem
```

### Step 2: Install Dependencies

```bash
# Using Bun (recommended - faster)
bun install

# OR using npm
npm install
```

### Step 3: Set Up Environment Variables

```bash
# Copy the template
cp .env.example .env.local
```

**Edit `.env.local`** with your Supabase credentials:

```bash
# Get these from: https://supabase.com/dashboard/project/usipijjyqfpxmhjbebyo/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://usipijjyqfpxmhjbebyo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.usipijjyqfpxmhjbebyo.supabase.co:5432/postgres
NODE_VERSION=20
```

**👉 See `CREDENTIALS_PRIVATE.md` for actual values** (if you have access)

### Step 4: Run Development Server

```bash
# Using Bun
bun run dev

# OR using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (15 Minutes)

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Sign in to your account
3. Select project: **usipijjyqfpxmhjbebyo**
4. Navigate to: **SQL Editor** (left sidebar)

### Step 2: Create Database Schema

Run these SQL scripts **in order**:

#### Script 1: Core Schema (Required)
```bash
# File: database/schema.sql
# Creates: households, population, citizens, voters, polling_results, audit_logs
```

1. Open `database/schema.sql` in your code editor
2. Copy all contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or Ctrl+Enter)
5. Verify: "Success. X rows affected" or "Success. No rows returned"

#### Script 2: User Authentication (Required)
```bash
# File: database/user_profiles_schema.sql
# Creates: user_profiles table with Row-Level Security policies
```

1. Open `database/user_profiles_schema.sql`
2. Copy all contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Verify table created successfully

#### Script 3: Demo User Accounts (Optional - for workshop)
```bash
# File: database/create_demo_accounts.sql
# Creates: 4 demo user accounts (Administrator, Analyst, Supervisor, Enumerator)
```

**Follow the 3-step process in the SQL file**:
1. Create auth users via Supabase Dashboard → Authentication → Users
2. Get user UUIDs
3. Run INSERT statements with actual UUIDs

**See**: `DEMO_ACCOUNT_SETUP_GUIDE.md` for detailed instructions

### Step 3: Verify Database Setup

Run this verification query in SQL Editor:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables:
-- audit_logs, citizens, households, polling_results, population, user_profiles, voters
```

---

## 🔐 Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | Supabase Dashboard → Settings → API |
| `DATABASE_URL` | PostgreSQL connection string | Supabase Dashboard → Settings → Database |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key (server-side only) | Not required for client app |
| `NODE_ENV` | Environment mode | development |
| `NODE_VERSION` | Node.js version for deployment | 20 |

---

## 🧪 Testing the Setup

### 1. Test Homepage
```bash
# Open: http://localhost:3000
# Expected: PNG Electoral System main dashboard
```

### 2. Test Login Page
```bash
# Open: http://localhost:3000/login
# Try demo account (if created):
# Email: admin@demo.pg
# Password: demo123
```

### 3. Test Database Connection
```bash
# Open: http://localhost:3000/census-dashboard
# Expected: Charts load with data (or empty if no data yet)
```

### 4. Run Critical Tests
```bash
# See: PRE_WORKSHOP_TEST_EXECUTION.md
# Execute 20 critical test scenarios
```

---

## 🎯 Next Steps After Setup

### For Development

1. **Explore the System**:
   - Main Dashboard: `/`
   - Census Registration: `/census`
   - Enumerator App: `/enumerator`
   - Data Visualization: `/census-dashboard`
   - Login: `/login`

2. **Read Documentation**:
   - `README.md` - Project overview
   - `USER_GUIDES/ENUMERATOR_GUIDE.md` - Field procedures
   - `USER_GUIDES/SUPERVISOR_GUIDE.md` - Monitoring
   - `TESTING_CHECKLIST.md` - QA procedures

3. **Add Test Data**:
   - Register sample households via `/enumerator`
   - View data in `/census-dashboard`
   - Monitor progress in `/census-monitoring`

### For Production Deployment

1. **Configure Automated Backups**:
   - Follow: `BACKUP_CONFIG_GUIDE.md`
   - Enable Point-in-Time Recovery
   - Set up off-site backups

2. **Create Production Users**:
   - Follow: `DEMO_ACCOUNT_SETUP_GUIDE.md`
   - Create real enumerator accounts
   - Set up supervisors and analysts

3. **Deploy to Netlify/Vercel**:
   ```bash
   # Build production version
   bun run build

   # Test production build locally
   bun run start
   ```

4. **Run Full Test Suite**:
   - Follow: `PRE_WORKSHOP_TEST_EXECUTION.md`
   - Achieve 90%+ pass rate (18/20 tests)

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lock .next
bun install
bun run dev
```

### Issue: Supabase connection fails

**Check**:
1. ✅ `.env.local` has correct credentials
2. ✅ Supabase project is active (not paused)
3. ✅ Anon key is valid (not expired)
4. ✅ URL format is correct: `https://xxx.supabase.co`

**Test connection**:
```bash
# Open browser console at http://localhost:3000
# Run: localStorage (should show Supabase auth data if connected)
```

### Issue: Database tables don't exist

**Solution**:
```bash
# Re-run database schema scripts in Supabase SQL Editor
# 1. database/schema.sql
# 2. database/user_profiles_schema.sql
```

### Issue: Can't login with demo accounts

**Check**:
1. ✅ Demo accounts created in Supabase Auth
2. ✅ User profiles inserted in `user_profiles` table
3. ✅ UUIDs match between `auth.users` and `user_profiles`

**Debug**:
```sql
-- Check if user exists
SELECT * FROM auth.users WHERE email = 'admin@demo.pg';

-- Check if profile exists
SELECT * FROM user_profiles WHERE email = 'admin@demo.pg';
```

### Issue: Charts not loading

**Possible causes**:
- No data in database yet (expected on fresh install)
- Census service error
- Database query timeout

**Solution**:
```bash
# Add test data first via /enumerator
# Then check /census-dashboard again
```

### Issue: Build fails

**Common fixes**:
```bash
# TypeScript errors
bun run lint

# Next.js cache issues
rm -rf .next
bun run build

# Node version mismatch
nvm use 20  # or install Node 20
```

---

## 📚 Additional Resources

### Documentation

- **User Guides** (173 pages):
  - `USER_GUIDES/ENUMERATOR_GUIDE.md` (15 pages)
  - `USER_GUIDES/SUPERVISOR_GUIDE.md` (20 pages)
  - `USER_GUIDES/ANALYST_GUIDE.md` (18 pages)
  - `USER_GUIDES/ADMINISTRATOR_GUIDE.md` (25 pages)

- **Technical Docs** (48 pages):
  - `TESTING_CHECKLIST.md` (22 pages)
  - `DATABASE_BACKUP_RECOVERY.md` (18 pages)
  - `BACKUP_CONFIG_GUIDE.md` (14 pages)

- **Workshop Materials** (71 pages):
  - `WORKSHOP_PRESENTATION.md` (35 pages)
  - `LIVE_DEMO_SCRIPTS.md` (28 pages)
  - `WORKSHOP_MATERIALS_PREP.md` (8 pages)

- **Implementation Guides** (26 pages):
  - `DEMO_ACCOUNT_SETUP_GUIDE.md` (6 pages)
  - `PRE_WORKSHOP_TEST_EXECUTION.md` (12 pages)
  - `ALL_TASKS_COMPLETE.md` (8 pages)

### External Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Washington Group Disability Questions**: https://www.washingtongroup-disability.com/

---

## 🎯 Success Checklist

Before considering setup complete, verify:

- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors
- [ ] `.env.local` created with valid credentials
- [ ] Database schema created (all 7 tables)
- [ ] Development server runs without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Can navigate to different pages
- [ ] Database connection works (charts load or show empty state)
- [ ] No TypeScript errors (`bun run lint`)
- [ ] Production build succeeds (`bun run build`)

**Optional** (for full production readiness):
- [ ] Demo user accounts created
- [ ] Sample census data added
- [ ] All 20 critical tests pass
- [ ] Automated backups configured
- [ ] Production deployment completed

---

## 📞 Getting Help

### Documentation
- Check relevant guide in `USER_GUIDES/` folder
- Search `TESTING_CHECKLIST.md` for specific test scenarios
- Review `DATABASE_BACKUP_RECOVERY.md` for backup issues

### Support
- **Technical Support**: support@same.new
- **GitHub Issues**: https://github.com/emabi2002/pngelectoralsystem/issues
- **Supabase Support**: https://supabase.com/support

### Workshop
- **Dates**: October 13-15, 2025
- **Venue**: Hilton Hotel, Port Moresby
- **Questions**: See `WORKSHOP_PRESENTATION.md` for FAQ

---

## 🔄 Updating the System

### Pull Latest Changes

```bash
git pull origin main
bun install  # Install any new dependencies
bun run dev  # Restart dev server
```

### Update Database Schema

If schema changes are released:
```bash
# Backup first!
# Then run new migration scripts in Supabase SQL Editor
```

---

## 🇵🇬 Ready for PNG Electoral Commission

Your system is now set up and ready for:
- ✅ Field enumeration with offline support
- ✅ Disability-inclusive census (Washington Group)
- ✅ Voter registration with biometric deduplication
- ✅ Real-time progress monitoring
- ✅ Professional data visualization and reporting

**System URL** (after deployment): https://same-6yf918d9bnu-latest.netlify.app
**GitHub Repository**: https://github.com/emabi2002/pngelectoralsystem

---

**Setup Time**: ~20 minutes (first time), ~5 minutes (subsequent)
**Last Updated**: October 10, 2025
**Version**: 12 (Production Ready)

**🎉 You're all set! Happy developing!**
