# PNG Electoral Registration System - Production Setup Guide

## Overview

This guide provides step-by-step instructions for deploying the PNG Electoral Registration System in a production environment with PNG NID integration.

## Prerequisites

- Supabase account with a project created
- PNG NID API credentials (contact PNG NID System Administrator)
- Node.js 20.x or higher
- Bun package manager installed
- Git installed

## Part 1: Database Setup

### Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click "New Project"
3. Configure:
   - **Name**: PNG Electoral System
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to Papua New Guinea
4. Wait for project to be provisioned

### Step 2: Get Database Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (keep this secure!)

3. Go to **Settings** → **Database**
4. Copy the **Connection String**

### Step 3: Run Database Migrations

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Connect to your project:
   ```bash
   cd png-digital-electoral-system
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Run the electoral roll schema:
   ```bash
   supabase db execute -f database/electoral_roll_schema.sql
   ```

4. Run other required schemas:
   ```bash
   supabase db execute -f database/schema.sql
   supabase db execute -f database/user_profiles_schema.sql
   supabase db execute -f database/biometrics_schema.sql
   ```

5. Verify tables were created:
   ```sql
   -- Go to Supabase Dashboard → SQL Editor and run:
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

   You should see:
   - `electoral_roll`
   - `user_profiles`
   - `households`
   - `population`
   - `citizens`
   - `voters`
   - And others...

## Part 2: PNG NID API Integration

### Step 1: Obtain PNG NID API Credentials

Contact the PNG National Identification System Administrator to get:
- **API Base URL**: `https://api.pngnid.gov.pg/v1` (example)
- **API Key**: Your organization's API key
- **API Documentation**: Endpoint specifications

### Step 2: Test PNG NID API Connection

Before configuring the system, test your API credentials:

```bash
# Test NID search endpoint
curl -X GET "https://api.pngnid.gov.pg/v1/citizens/search/nid/PNG123456789" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Expected response:
# {
#   "nid_number": "PNG123456789",
#   "full_name": "John Citizen",
#   "date_of_birth": "1990-01-01",
#   ...
# }
```

If you receive errors:
- Check API key is correct
- Verify API endpoint URL
- Confirm your organization has API access enabled
- Contact PNG NID support

## Part 3: Application Configuration

### Step 1: Clone Repository

```bash
git clone https://github.com/emabi2002/pngelectoralsystem.git
cd pngelectoralsystem
```

### Step 2: Install Dependencies

```bash
bun install
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in all values:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres

   # PNG NID API Configuration
   NEXT_PUBLIC_PNG_NID_API_URL=https://api.pngnid.gov.pg/v1
   NEXT_PUBLIC_PNG_NID_API_KEY=your_png_nid_api_key_here

   # Security
   NEXT_PUBLIC_ENCRYPTION_KEY=generate_random_32_character_key

   # Environment
   NODE_ENV=production
   NODE_VERSION=20
   ```

3. Generate encryption key:
   ```bash
   openssl rand -base64 32
   ```

### Step 4: Test Local Development

```bash
bun run dev
```

Visit `http://localhost:3000` and verify:
- ✅ Home page loads
- ✅ Electoral Roll Search page accessible
- ✅ Database connection working

## Part 4: Production Deployment

### Option A: Deploy to Netlify

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Production configuration"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `pngelectoralsystem` repo
   - Branch to deploy: `main`

3. **Configure Build Settings**:
   - Build command: `bun run build`
   - Publish directory: `.next`
   - Install command: `bun install`

4. **Add Environment Variables**:
   Go to **Site settings** → **Environment variables** and add all variables from `.env.local`

5. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Visit your site URL

### Option B: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add NEXT_PUBLIC_PNG_NID_API_URL
   vercel env add NEXT_PUBLIC_PNG_NID_API_KEY
   # ... add all other variables
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Part 5: Post-Deployment Configuration

### Step 1: Verify PNG NID Integration

1. Go to **Electoral Roll Search** page
2. Test NID search with a known test NID from PNG NID system
3. Verify:
   - ✅ Search completes without errors
   - ✅ Data returned from PNG NID API
   - ✅ Import to electoral roll works

### Step 2: Set Up User Accounts

Run the demo accounts setup (modify for production users):

```bash
bun run database/setup_demo_users.ts
```

Or create users manually in Supabase:
1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Create electoral officer accounts

### Step 3: Configure Row Level Security

Verify RLS policies are active:

```sql
-- In Supabase SQL Editor:
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### Step 4: Set Up Backup Schedule

1. In Supabase Dashboard, go to **Database** → **Backups**
2. Enable daily automatic backups
3. Set retention period (recommended: 30 days minimum)

## Part 6: Testing & Validation

### Functional Testing Checklist

#### Electoral Roll Search
- [ ] Search by valid NID number (found in electoral roll)
- [ ] Search by valid NID number (not in electoral roll, found in PNG NID)
- [ ] Search by invalid NID number (not found anywhere)
- [ ] Import from PNG NID to electoral roll
- [ ] Verify imported record appears in searches

#### Voter Registration
- [ ] Register new voter manually
- [ ] Upload voter photo
- [ ] Capture fingerprint (if biometric device connected)
- [ ] Verify record saved to database

#### Data Integrity
- [ ] Check duplicate NID numbers prevented
- [ ] Verify audit trail (created_at, updated_at timestamps)
- [ ] Confirm source field correctly set (png_nid vs manual_registration)

### Performance Testing

```sql
-- Test query performance:
EXPLAIN ANALYZE
SELECT * FROM electoral_roll
WHERE nid_number = 'PNG123456789';

-- Should use index and execute in < 1ms
```

### Security Testing

- [ ] Verify API keys not exposed in client-side code
- [ ] Test RLS policies prevent unauthorized access
- [ ] Confirm HTTPS enabled on production URL
- [ ] Verify Supabase service role key not in frontend

## Part 7: Monitoring & Maintenance

### Set Up Monitoring

1. **Supabase Monitoring**:
   - Go to **Database** → **Reports**
   - Monitor query performance
   - Track database size growth

2. **Error Tracking**:
   - Set up [Sentry](https://sentry.io) or similar
   - Monitor PNG NID API failures
   - Track database connection errors

3. **Usage Analytics**:
   ```sql
   -- Daily registration statistics:
   SELECT
     DATE(registration_date) as date,
     COUNT(*) as registrations,
     COUNT(*) FILTER (WHERE source = 'png_nid') as from_nid,
     COUNT(*) FILTER (WHERE source = 'manual_registration') as manual
   FROM electoral_roll
   GROUP BY DATE(registration_date)
   ORDER BY date DESC
   LIMIT 30;
   ```

### Regular Maintenance Tasks

**Daily**:
- Monitor error logs
- Check PNG NID API connectivity
- Review new registrations

**Weekly**:
- Review electoral roll statistics
- Check for duplicate records
- Verify backup completion

**Monthly**:
- Database performance optimization
- Review and archive old audit logs
- Update dependencies and security patches

## Part 8: Troubleshooting

### PNG NID API Issues

**Problem**: "Failed to connect to PNG NID system"

**Solutions**:
1. Verify API key is correct in environment variables
2. Check API endpoint URL
3. Test API with curl command
4. Contact PNG NID support

### Database Connection Issues

**Problem**: "Database connection failed"

**Solutions**:
1. Verify Supabase credentials in `.env.local`
2. Check database connection string
3. Ensure IP whitelist includes your server (if applicable)
4. Review Supabase project status

### Import Failures

**Problem**: "Failed to import from PNG NID"

**Solutions**:
1. Check NID data completeness (required fields)
2. Verify no duplicate NID number exists
3. Review database logs for constraint violations
4. Check RLS policies allow insert

## Part 9: System Administration

### Managing Electoral Roll

```sql
-- View all active voters:
SELECT * FROM electoral_roll WHERE status = 'active';

-- Statistics by province:
SELECT * FROM electoral_roll_stats;

-- Search for voter:
SELECT * FROM electoral_roll
WHERE full_name ILIKE '%John%'
OR nid_number = 'PNG123456789';

-- Update voter status:
UPDATE electoral_roll
SET status = 'inactive', last_updated = NOW()
WHERE nid_number = 'PNG123456789';

-- Bulk update polling stations:
UPDATE electoral_roll
SET polling_station = 'Port Moresby Central'
WHERE district = 'National Capital District'
AND llg_ward = 'Moresby North-East';
```

### Data Export

```bash
# Export electoral roll to CSV:
psql $DATABASE_URL -c "\COPY (SELECT * FROM electoral_roll WHERE status = 'active') TO 'electoral_roll_export.csv' CSV HEADER"
```

## Part 10: Support & Escalation

### Support Contacts

- **System Issues**: IT Support Team
- **PNG NID API Issues**: PNG NID Administrator
- **Database Issues**: Database Administrator
- **Electoral Commission**: Electoral Commission IT Department

### Escalation Matrix

| Issue Level | Response Time | Contact |
|-------------|---------------|---------|
| Critical (System Down) | 15 minutes | IT Director |
| High (PNG NID API Failure) | 1 hour | System Administrator |
| Medium (Performance Issues) | 4 hours | IT Support |
| Low (User Training) | Next business day | Help Desk |

## Security Considerations

### Data Protection

- All biometric data encrypted at rest
- PNG NID API calls use TLS 1.3
- Database credentials stored securely in environment variables
- Row Level Security enforced on all tables
- Audit logging for all electoral roll changes

### Access Control

- Implement user authentication for production
- Role-based access (administrator, electoral officer, viewer)
- IP whitelisting for admin functions
- MFA for privileged accounts

### Compliance

- Follow PNG Data Protection Act requirements
- Electoral Commission data handling policies
- PNG NID data sharing agreements
- Regular security audits

---

## Quick Reference

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase service role key (server-side only)
DATABASE_URL=                       # PostgreSQL connection string
NEXT_PUBLIC_PNG_NID_API_URL=        # PNG NID API base URL
NEXT_PUBLIC_PNG_NID_API_KEY=        # PNG NID API key
NEXT_PUBLIC_ENCRYPTION_KEY=         # 32-character encryption key
NODE_ENV=production                 # Environment
NODE_VERSION=20                     # Node.js version
```

### Useful Commands

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun start

# Run database migrations
supabase db execute -f database/electoral_roll_schema.sql

# Check lint errors
bun run lint

# Run type checking
bun run type-check
```

### Database Queries

```sql
-- Total voters in electoral roll
SELECT COUNT(*) FROM electoral_roll WHERE status = 'active';

-- Voters by province
SELECT province, COUNT(*) FROM electoral_roll GROUP BY province;

-- Recent registrations
SELECT * FROM electoral_roll ORDER BY registration_date DESC LIMIT 100;

-- PNG NID vs Manual registrations
SELECT source, COUNT(*) FROM electoral_roll GROUP BY source;
```

---

**System Version**: 2.0
**Last Updated**: October 2025
**Status**: Production Ready
