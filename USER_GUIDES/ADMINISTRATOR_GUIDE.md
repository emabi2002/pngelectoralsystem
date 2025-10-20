# Administrator User Guide
## PNG Population & Housing Census System

**Version 10.0 | October 2025**

---

## 🔐 System Administrator Role

### Responsibilities
- **User Management**: Create, modify, and deactivate user accounts
- **System Configuration**: Configure system settings and parameters
- **Data Security**: Ensure data protection and privacy compliance
- **System Monitoring**: Monitor system performance and uptime
- **Backup Management**: Oversee data backups and disaster recovery
- **Access Control**: Manage role-based permissions
- **Technical Support**: Provide tier-2/3 technical assistance

---

## 🚀 Getting Started

### Login
- **URL**: `/login`
- **Demo Credentials**:
  - Email: `admin@demo.pg`
  - Password: `demo123`
- **Access**: Full system access (all routes and functions)

---

## 👥 User Management

### Creating New Users

#### Via Database (Recommended for Bulk)
1. Access Supabase Dashboard
2. Navigate to Authentication → Users
3. Click "Add User"
4. Fill in:
   - Email
   - Password (will be sent to user)
   - Auto Confirm Email: Yes
5. After creating auth user, add profile:

```sql
INSERT INTO user_profiles (id, email, full_name, role, province, district, enumeration_area, phone_number, is_active)
VALUES (
  'auth-user-id-here',
  'user@example.pg',
  'Full Name',
  'enumerator', -- or 'supervisor', 'analyst', 'administrator'
  'Province Name',
  'District Name',
  'EA-XXX-XXX', -- for enumerators
  '+675 72345678',
  true
);
```

#### User Roles

**Enumerator**
- Access: `/enumerator`, `/census`, `/register`
- Permissions: Register households and population, view own data
- Assignment: Specific enumeration area

**Supervisor**
- Access: `/census-monitoring`, `/household-management`, plus enumerator access
- Permissions: View/edit data in assigned province/district, manage enumerators
- Assignment: Province or district

**Analyst**
- Access: `/census-dashboard`, `/census-monitoring`, `/household-management`
- Permissions: View all data, export reports, no editing
- Assignment: National level

**Administrator**
- Access: All routes and functions
- Permissions: Full system control
- Assignment: National level

---

### Bulk User Creation Script

Use the provided script: `database/setup_demo_users.ts`

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your-project-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# Run script
bun run database/setup_demo_users.ts
```

This creates all 4 demo accounts automatically.

---

### User Account Management

#### Viewing All Users

```sql
SELECT id, email, full_name, role, province, district, is_active, created_at, last_login
FROM user_profiles
ORDER BY created_at DESC;
```

#### Deactivating a User

```sql
UPDATE user_profiles
SET is_active = false
WHERE email = 'user@example.pg';
```

#### Reactivating a User

```sql
UPDATE user_profiles
SET is_active = true
WHERE email = 'user@example.pg';
```

#### Changing User Role

```sql
UPDATE user_profiles
SET role = 'supervisor' -- new role
WHERE email = 'user@example.pg';
```

#### Resetting User Password
1. Go to Supabase Dashboard → Authentication → Users
2. Find user by email
3. Click "..." menu → "Send Password Recovery"
4. User receives reset email

---

## 🗄️ Database Management

### Database Schema

**Tables**:
- `households`: Household census data
- `population`: Individual person records
- `citizens`: PNG NID citizen data
- `voters`: Electoral roll
- `polling_results`: Election results
- `audit_logs`: System audit trail
- `user_profiles`: User accounts

### Schema Updates

**Always backup before schema changes!**

```sql
-- Example: Adding a new field
ALTER TABLE households
ADD COLUMN new_field_name TEXT;

-- Create index for performance
CREATE INDEX idx_new_field ON households(new_field_name);
```

### Data Integrity Checks

```sql
-- Check for orphaned population records (no household)
SELECT p.id, p.full_name, p.household_id
FROM population p
LEFT JOIN households h ON p.household_id = h.id
WHERE h.id IS NULL;

-- Check for households with no members
SELECT h.id, h.household_number, h.total_members
FROM households h
LEFT JOIN population p ON h.id = p.household_id
WHERE p.id IS NULL
  AND h.total_members > 0;

-- Verify disability flag consistency
SELECT id, full_name, has_disability,
       difficulty_seeing, difficulty_hearing, difficulty_walking,
       difficulty_remembering, difficulty_selfcare, difficulty_communicating
FROM population
WHERE has_disability = false
  AND (
    difficulty_seeing IN ('A lot of difficulty', 'Cannot do at all')
    OR difficulty_hearing IN ('A lot of difficulty', 'Cannot do at all')
    OR difficulty_walking IN ('A lot of difficulty', 'Cannot do at all')
    OR difficulty_remembering IN ('A lot of difficulty', 'Cannot do at all')
    OR difficulty_selfcare IN ('A lot of difficulty', 'Cannot do at all')
    OR difficulty_communicating IN ('A lot of difficulty', 'Cannot do at all')
  );
```

---

## 🔒 Security & Access Control

### Row Level Security (RLS) Policies

**Status**: Enabled on all tables

**Key Policies**:
- Users can only view their own profile
- Enumerators can only view/edit data in their EA
- Supervisors can view/edit data in their province
- Analysts can view all data (read-only)
- Administrators have full access

### Reviewing RLS Policies

```sql
SELECT schemaname, tablename, policyname, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Audit Trail

All data modifications are logged in `audit_logs`:

```sql
SELECT
  al.created_at,
  up.full_name as user_name,
  al.action,
  al.table_name,
  al.record_id,
  al.new_values
FROM audit_logs al
JOIN user_profiles up ON al.user_id = up.id
ORDER BY al.created_at DESC
LIMIT 100;
```

---

## 💾 Backup & Recovery

### Automated Backups (Supabase)

**Daily Backups**: Automatic (last 7 days retained)
**Weekly Backups**: Automatic (last 4 weeks retained)
**Point-in-Time Recovery**: Available for last 7 days

**Configuration**:
1. Supabase Dashboard → Settings → Backups
2. Verify schedule: Daily at 00:00 UTC
3. Retention: 7 days
4. Enable Point-in-Time Recovery: Yes

### Manual Backup

```bash
# Using pg_dump
pg_dump -h your-db-host \
  -U postgres \
  -d postgres \
  -f backup_$(date +%Y%m%d_%H%M%S).sql

# Backup specific tables
pg_dump -h your-db-host \
  -U postgres \
  -d postgres \
  -t households \
  -t population \
  -f census_backup_$(date +%Y%m%d).sql
```

### Restore from Backup

**From Supabase Dashboard**:
1. Settings → Backups
2. Select backup date
3. Click "Restore"
4. Confirm (⚠️ This overwrites current data)

**From SQL File**:
```bash
psql -h your-db-host \
  -U postgres \
  -d postgres \
  -f backup_20251010_120000.sql
```

### Disaster Recovery Plan

See: `DATABASE_BACKUP_RECOVERY.md`

**Key Steps**:
1. Assess damage extent
2. Notify stakeholders
3. Restore from most recent backup
4. Verify data integrity
5. Resume operations
6. Document incident

---

## 📊 System Monitoring

### Performance Metrics

**Database Performance**:
```sql
-- Slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 1000 -- queries taking >1 second
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT count(*) as connection_count
FROM pg_stat_activity;
```

**Application Health**:
- Monitor: Supabase Dashboard → Metrics
- Check: CPU usage, Memory, Database connections
- Alert: Set up alerts for >80% utilization

### Usage Statistics

```sql
-- User activity
SELECT
  DATE(created_at) as date,
  COUNT(*) as logins
FROM user_profiles
WHERE last_login IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Registration activity
SELECT
  DATE(created_at) as date,
  COUNT(*) as households_registered
FROM households
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Population enumeration
SELECT
  DATE(enumeration_date) as date,
  COUNT(*) as individuals_registered
FROM population
GROUP BY DATE(enumeration_date)
ORDER BY date DESC;
```

---

## 🔧 System Configuration

### Environment Variables

**File**: `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key # Server-side only
```

**Never commit `.env.local` to version control!**

### Application Settings

**File**: `next.config.js`

```javascript
module.exports = {
  output: 'export', // Static export for deployment
  distDir: 'out',
  images: {
    unoptimized: true // Required for static export
  }
}
```

### Database Connection Pool

**Supabase Dashboard → Settings → Database**
- Max connections: 100 (adjust based on load)
- Connection timeout: 10 seconds
- Idle timeout: 5 minutes

---

## 📱 Progressive Web App (PWA)

### Service Worker

**File**: `public/sw.js`

**Capabilities**:
- Offline functionality
- Asset caching
- Background sync

### Manifest

**File**: `public/manifest.json`

```json
{
  "name": "PNG Census System",
  "short_name": "PNG Census",
  "description": "Population & Housing Census",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a"
}
```

### Testing PWA
1. Open DevTools → Application
2. Check Service Workers registered
3. Test "Add to Home Screen"
4. Verify offline functionality

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Users can't log in
**Diagnostics**:
```sql
-- Check user exists
SELECT * FROM auth.users WHERE email = 'user@example.pg';

-- Check profile exists
SELECT * FROM user_profiles WHERE email = 'user@example.pg';

-- Check account active
SELECT is_active FROM user_profiles WHERE email = 'user@example.pg';
```

**Solutions**:
- Verify email confirmed
- Check is_active = true
- Reset password if needed
- Verify RLS policies not blocking

#### Issue: Slow dashboard performance
**Diagnostics**:
- Check database query performance (see monitoring section)
- Review browser console for errors
- Check network tab for slow API calls

**Solutions**:
- Add database indexes on frequently queried fields
- Implement pagination for large datasets
- Enable caching where appropriate
- Optimize complex queries

#### Issue: Data sync failures
**Diagnostics**:
- Check browser console for errors
- Verify internet connection
- Check Supabase status page

**Solutions**:
- Retry sync manually
- Check for database locks
- Verify user permissions
- Clear browser cache and retry

---

## 📦 Deployment

### Netlify Deployment (Current)

**Status**: Deployed at `https://same-6yf918d9bnu-latest.netlify.app`

**Configuration**: `netlify.toml`

```toml
[build]
  command = "bun run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Deployment (Alternative)

**Repository**: [To be configured]

**GitHub Actions**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: bun install
      - run: bun run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### Production Checklist

Before deploying to production:
- [ ] All environment variables set
- [ ] Database backup created
- [ ] User accounts created
- [ ] Demo data populated
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] User guides distributed
- [ ] Support team briefed
- [ ] Rollback plan prepared

---

## 🎓 Training & Support

### Training Materials

**Location**: `/USER_GUIDES/`

- `ENUMERATOR_GUIDE.md`
- `SUPERVISOR_GUIDE.md`
- `ANALYST_GUIDE.md`
- `ADMINISTRATOR_GUIDE.md`

### Workshop Preparation

**Materials**:
1. System overview presentation
2. Live demo scenarios
3. Hands-on exercises
4. Troubleshooting guide
5. Q&A session

**Demo Accounts Ready**:
- ✅ Enumerator
- ✅ Supervisor
- ✅ Analyst
- ✅ Administrator

---

## 📞 Support Escalation

### Tier 1: Help Desk
- Basic user questions
- Password resets
- Account activation

### Tier 2: Technical Support
- Application errors
- Data sync issues
- Report generation problems

### Tier 3: System Administrator (You)
- Database issues
- Security incidents
- System configuration
- Performance problems

### Tier 4: Development Team
- Code bugs
- Feature requests
- Architecture changes

**Contact**: support@same.new

---

## 📋 Administrator Checklist

### Daily
- [ ] Review system health metrics
- [ ] Check backup completion
- [ ] Monitor user login issues
- [ ] Review audit logs for anomalies
- [ ] Respond to support tickets

### Weekly
- [ ] Generate usage statistics report
- [ ] Review and optimize slow queries
- [ ] Check data quality metrics
- [ ] Update user documentation if needed
- [ ] Meet with supervisors for feedback

### Monthly
- [ ] Database maintenance (vacuum, analyze)
- [ ] Security audit
- [ ] User access review
- [ ] Capacity planning review
- [ ] System update evaluation

### Quarterly
- [ ] Disaster recovery drill
- [ ] Full system backup archive
- [ ] Performance optimization review
- [ ] User training refresher
- [ ] Documentation update

---

## 🔐 Security Best Practices

1. **Never share service role keys**
2. **Use strong passwords** (min 12 characters)
3. **Enable 2FA** on Supabase account
4. **Review audit logs** regularly
5. **Rotate API keys** annually
6. **Limit admin accounts** (principle of least privilege)
7. **Monitor for suspicious activity**
8. **Keep dependencies updated**
9. **Backup before changes**
10. **Document all configuration changes**

---

**🇵🇬 You are the guardian of PNG's digital census infrastructure!**

Your expertise ensures the system runs smoothly, securely, and reliably.

---

**Questions? Contact: support@same.new**

**Version 10.0 | PNG Electoral Commission | October 2025**
