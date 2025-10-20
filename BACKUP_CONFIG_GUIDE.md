# Supabase Backup Configuration & DR Testing Guide
## PNG Digital Electoral System

**Critical Task**: Must Complete Before Production Deployment
**Time Required**: 2-3 hours
**Responsibility**: System Administrator

---

## 🎯 Objectives

1. Configure automated daily and weekly backups in Supabase
2. Enable Point-in-Time Recovery (PITR)
3. Set up off-site backup to AWS S3 (optional but recommended)
4. Test restore procedures
5. Conduct disaster recovery drill

---

## 📋 Prerequisites

**Required Access**:
- [ ] Supabase Dashboard access (admin role)
- [ ] Supabase Service Role Key
- [ ] AWS Account (for off-site backup - optional)
- [ ] PostgreSQL client tools (pg_dump, psql)

**Required Information**:
- Supabase Project URL: `https://usipijjyqfpxmhjbebyo.supabase.co`
- Database Host: `db.usipijjyqfpxmhjbebyo.supabase.co`
- Database Name: `postgres`
- Database Password: (from Supabase Settings)

---

## PART 1: Supabase Automated Backups (30 minutes)

### Step 1: Access Backup Settings

1. **Login to Supabase**:
   - Go to: https://supabase.com/dashboard
   - Sign in to your account
   - Select project: **usipijjyqfpxmhjbebyo**

2. **Navigate to Backup Settings**:
   - Left sidebar → Click **Settings** (gear icon)
   - Click **Database** tab
   - Scroll down to **Backups** section

---

### Step 2: Configure Daily Backups

**Current Status Check**:
- Look for "Automated backups"
- Check if "Enabled" toggle is ON

**Configuration**:
1. **Enable Automated Backups**: Toggle to **ON** (if not already)
2. **Frequency**: Should show **"Daily"**
3. **Backup Time**: Default is **00:00 UTC** (11:00 AM Port Moresby time)
   - ✅ **Recommended**: Keep default
   - Or change to off-peak hours if preferred
4. **Retention**: Check shows **"7 days"**

**Verify**:
- [ ] Automated Backups: **Enabled**
- [ ] Frequency: **Daily**
- [ ] Retention: **7 days**

**Screenshot**: Take a screenshot for documentation

---

### Step 3: Enable Point-in-Time Recovery (PITR)

**What is PITR?**
- Allows restoration to ANY point in time within the last 7 days
- Down to the second precision
- Critical for accidental data deletion scenarios

**Enable PITR**:
1. In same **Database → Backups** section
2. Find **"Point-in-Time Recovery"** toggle
3. Toggle to **ON**
4. **Confirm** the prompt (may have cost implications on free tier)

**Expected Cost** (as of 2025):
- Supabase Pro plan: Included
- Free tier: May require upgrade to Pro

**Verify**:
- [ ] PITR: **Enabled**
- [ ] Coverage: **Last 7 days**

**Notes**:
- PITR uses Write-Ahead Logs (WAL) for recovery
- Minimal performance impact
- Essential for production systems

---

### Step 4: Weekly Backup Configuration

**Supabase automatically configures weekly backups on Pro plan**:
- Every Sunday at 00:00 UTC
- Retention: 28 days (4 weeks)
- No additional configuration needed

**Verify** (in Backup history):
- Look for weekly backups (labeled "Weekly")
- Check retention period

---

### Step 5: View Existing Backups

**In Supabase Dashboard**:
1. Still in **Settings → Database → Backups**
2. Scroll to **"Backup History"** section
3. Should see list of backups with:
   - Backup date/time
   - Type (Daily, Weekly, Manual)
   - Size
   - Status (Available, In Progress, Failed)
   - Actions (Restore, Download)

**First Backup**:
- If this is a new setup, first backup may be scheduled for tonight
- Check "Next Backup" timestamp

---

### Step 6: Create Manual Backup (For Testing)

**Create a Backup Now**:
1. Click **"Create Backup"** button
2. Add description: "Pre-workshop manual backup - October 12, 2025"
3. Click **"Create"**
4. Wait for completion (5-15 minutes depending on database size)

**Monitor Progress**:
- Backup status will show "In Progress"
- Refresh page to check status
- When complete, status changes to "Available"

**Verify Manual Backup**:
- [ ] Manual backup appears in history
- [ ] Status: **Available**
- [ ] Size: _______ MB (record for comparison)
- [ ] Description matches

---

## PART 2: Off-Site Backup Setup (Optional - 1 hour)

### Overview

**Why Off-Site Backup?**
- Extra protection if Supabase itself has an outage
- Compliance with 3-2-1 backup rule (3 copies, 2 different media, 1 offsite)
- Geographic redundancy

**We'll use AWS S3** (can also use Google Cloud Storage or similar)

---

### Step 1: Set Up AWS S3 Bucket

**If you have AWS account**:

1. **Login to AWS Console**: https://console.aws.amazon.com
2. **Navigate to S3**: Services → Storage → S3
3. **Create Bucket**:
   - Click **"Create bucket"**
   - Bucket name: `png-census-backups-2025` (must be globally unique)
   - Region: **ap-southeast-2** (Sydney - closest to PNG)
   - Block Public Access: **All ON** (private bucket)
   - Versioning: **Enable**
   - Encryption: **Enable** (SSE-S3)
   - Click **"Create bucket"**

4. **Create IAM User for Backups**:
   - Navigate to **IAM** service
   - Click **Users** → **Add User**
   - Username: `png-census-backup-user`
   - Access type: **Programmatic access** (API only)
   - Attach policy: **AmazonS3FullAccess** (or create custom policy for specific bucket)
   - Click **Create user**
   - **IMPORTANT**: Save Access Key ID and Secret Access Key

5. **Configure Lifecycle Policy** (Auto-archive old backups):
   - In S3 bucket, go to **Management** tab
   - Click **Create lifecycle rule**
   - Name: "Archive old backups"
   - Transition to Glacier after: **90 days**
   - Expire objects after: **365 days** (or never)
   - Click **Create rule**

---

### Step 2: Install AWS CLI (If Not Already)

**On your computer or server**:

```bash
# macOS
brew install awscli

# Ubuntu/Debian
sudo apt-get install awscli

# Windows
# Download from: https://aws.amazon.com/cli/
```

**Configure AWS CLI**:
```bash
aws configure
# Enter:
# AWS Access Key ID: [from Step 1]
# AWS Secret Access Key: [from Step 1]
# Default region: ap-southeast-2
# Default output format: json
```

**Test Connection**:
```bash
aws s3 ls s3://png-census-backups-2025
# Should return empty list (new bucket)
```

---

### Step 3: Create Backup Script

**Create file**: `backup_to_s3.sh`

```bash
#!/bin/bash

# PNG Census System - AWS S3 Backup Script
# Run this weekly via cron

# Configuration
BACKUP_DIR="/tmp/png_census_backups"
S3_BUCKET="s3://png-census-backups-2025"
DATE=$(date +%Y%m%d_%H%M%S)
DB_HOST="db.usipijjyqfpxmhjbebyo.supabase.co"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="YOUR_DB_PASSWORD_HERE"  # CHANGE THIS!

# Create backup directory
mkdir -p $BACKUP_DIR

# Log start
echo "[$(date)] Starting backup to S3..."

# Create database backup
echo "[$(date)] Creating PostgreSQL dump..."
PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -U $DB_USER \
  -d $DB_NAME \
  -F c \
  -f $BACKUP_DIR/backup_$DATE.dump

# Check if backup successful
if [ $? -eq 0 ]; then
    echo "[$(date)] Database dump successful"
else
    echo "[$(date)] ERROR: Database dump failed!"
    exit 1
fi

# Compress backup
echo "[$(date)] Compressing backup..."
gzip $BACKUP_DIR/backup_$DATE.dump

# Upload to S3
echo "[$(date)] Uploading to S3..."
aws s3 cp \
  $BACKUP_DIR/backup_$DATE.dump.gz \
  $S3_BUCKET/backups/$DATE/ \
  --storage-class STANDARD_IA

# Check if upload successful
if [ $? -eq 0 ]; then
    echo "[$(date)] Upload to S3 successful"
else
    echo "[$(date)] ERROR: S3 upload failed!"
    exit 1
fi

# Cleanup local files (keep disk space free)
echo "[$(date)] Cleaning up local files..."
rm -f $BACKUP_DIR/backup_$DATE.dump.gz

# List S3 backups (for verification)
echo "[$(date)] Current S3 backups:"
aws s3 ls $S3_BUCKET/backups/ --recursive

echo "[$(date)] Backup complete!"
```

**Make Executable**:
```bash
chmod +x backup_to_s3.sh
```

---

### Step 4: Test Backup Script

**Run Manually First**:
```bash
./backup_to_s3.sh
```

**Expected Output**:
```
[2025-10-12 14:30:00] Starting backup to S3...
[2025-10-12 14:30:01] Creating PostgreSQL dump...
[2025-10-12 14:32:45] Database dump successful
[2025-10-12 14:32:46] Compressing backup...
[2025-10-12 14:33:15] Uploading to S3...
[2025-10-12 14:34:20] Upload to S3 successful
[2025-10-12 14:34:21] Cleaning up local files...
[2025-10-12 14:34:22] Current S3 backups:
2025-10-12 14:34:20  45.2 MB backups/20251012_143000/backup_20251012_143000.dump.gz
[2025-10-12 14:34:22] Backup complete!
```

**Verify in AWS Console**:
1. Go to S3 bucket: `png-census-backups-2025`
2. Navigate to `backups/` folder
3. Verify file exists and size is reasonable

---

### Step 5: Schedule Automatic Backups with Cron

**Edit crontab**:
```bash
crontab -e
```

**Add this line** (runs every Sunday at 2:00 AM):
```cron
0 2 * * 0 /path/to/backup_to_s3.sh >> /var/log/png_census_backup.log 2>&1
```

**Save and exit**

**Verify cron entry**:
```bash
crontab -l
```

**Check logs** (after first scheduled run):
```bash
tail -f /var/log/png_census_backup.log
```

---

## PART 3: Test Restore Procedures (1 hour)

### ⚠️ WARNING: Test in Development Environment First!

**NEVER test restore on production database!**

---

### Test Scenario 1: Restore from Supabase Dashboard Backup

**Objective**: Restore database to a specific backup

**Steps**:

1. **Create Test Data to Delete** (so we can verify restore):
   ```sql
   -- Connect to database via Supabase SQL Editor
   INSERT INTO households (household_number, province, district, llg_ward, village_settlement, dwelling_type, number_of_rooms, water_source, toilet_facility, electricity_source, cooking_fuel, owns_dwelling, total_members, enumerator_id, enumeration_date, enumeration_area)
   VALUES ('TEST-RESTORE-001', 'National Capital District', 'Test', 'Test', 'Test Village', 'Modern', 3, 'Piped', 'Flush', 'Grid', 'LPG', true, 1, 'test', CURRENT_DATE, 'TEST-EA');
   ```

2. **Verify Test Data Exists**:
   ```sql
   SELECT * FROM households WHERE household_number = 'TEST-RESTORE-001';
   -- Should return 1 row
   ```

3. **Create a Backup** (in Supabase Dashboard):
   - Settings → Database → Backups
   - Click "Create Backup"
   - Description: "Before delete test - $(date)"
   - Wait for completion

4. **Delete the Test Data** (simulating data loss):
   ```sql
   DELETE FROM households WHERE household_number = 'TEST-RESTORE-001';

   SELECT * FROM households WHERE household_number = 'TEST-RESTORE-001';
   -- Should return 0 rows
   ```

5. **Restore from Backup**:
   - Go to Supabase Dashboard → Settings → Database → Backups
   - Find the backup you just created
   - Click **"Restore"** button
   - **⚠️ WARNING**: This will OVERWRITE current database!
   - Confirm: "Yes, restore database"
   - Wait for restore (5-10 minutes)

6. **Verify Restoration**:
   ```sql
   SELECT * FROM households WHERE household_number = 'TEST-RESTORE-001';
   -- Should return 1 row again!
   ```

**✅ Test PASSED** if data is restored

---

### Test Scenario 2: Point-in-Time Recovery (PITR)

**Objective**: Restore to exact moment before accidental deletion

**Steps**:

1. **Note Current Time**:
   ```sql
   SELECT CURRENT_TIMESTAMP;
   -- Note: 2025-10-12 15:30:00+00
   ```

2. **Create Test Data**:
   ```sql
   INSERT INTO households (household_number, province, district, llg_ward, village_settlement, dwelling_type, number_of_rooms, water_source, toilet_facility, electricity_source, cooking_fuel, owns_dwelling, total_members, enumerator_id, enumeration_date, enumeration_area)
   VALUES ('PITR-TEST-001', 'National Capital District', 'Test', 'Test', 'PITR Village', 'Modern', 3, 'Piped', 'Flush', 'Grid', 'LPG', true, 1, 'test', CURRENT_DATE, 'PITR-EA');

   SELECT CURRENT_TIMESTAMP;
   -- Note: 2025-10-12 15:31:00+00 (after insert)
   ```

3. **Wait 2 minutes** (to have clear time separation)

4. **Delete the Data** (simulating accidental deletion):
   ```sql
   SELECT CURRENT_TIMESTAMP;
   -- Note: 2025-10-12 15:33:00+00 (before delete)

   DELETE FROM households WHERE household_number = 'PITR-TEST-001';

   SELECT CURRENT_TIMESTAMP;
   -- Note: 2025-10-12 15:33:15+00 (after delete)
   ```

5. **Use PITR to Restore** (to 15:33:00, BEFORE delete):
   - Supabase Dashboard → Settings → Database → Backups
   - Click **"Point-in-Time Recovery"** button
   - Select date: October 12, 2025
   - Select time: 15:33:00 (just before deletion)
   - Click **"Restore to this point"**
   - **⚠️ CONFIRM**: This will restore database to that exact second
   - Wait for restoration

6. **Verify**:
   ```sql
   SELECT * FROM households WHERE household_number = 'PITR-TEST-001';
   -- Should return 1 row (restored from before deletion)
   ```

**✅ Test PASSED** if data at exact timestamp is restored

---

### Test Scenario 3: Restore from AWS S3 Backup

**Objective**: Restore database from off-site backup

**Steps**:

1. **Download Backup from S3**:
   ```bash
   aws s3 cp s3://png-census-backups-2025/backups/LATEST_DATE/backup_XXXXXXXXXX.dump.gz .
   gunzip backup_XXXXXXXXXX.dump.gz
   ```

2. **Restore to Development Database** (NOT PRODUCTION!):
   ```bash
   pg_restore \
     -h db.usipijjyqfpxmhjbebyo.supabase.co \
     -U postgres \
     -d postgres_dev \
     -c \
     -v \
     backup_XXXXXXXXXX.dump
   ```

3. **Verify Tables Restored**:
   ```sql
   -- Connect to postgres_dev database
   SELECT count(*) FROM households;
   SELECT count(*) FROM population;
   SELECT count(*) FROM voters;
   -- Should match production counts
   ```

**✅ Test PASSED** if restore completes without errors

---

## PART 4: Disaster Recovery Drill (30 minutes)

### Scenario: Database Corruption Detected

**Objective**: Practice full DR workflow under pressure

**Time Limit**: 30 minutes to full recovery

---

### Phase 1: Discovery & Assessment (5 minutes)

**9:00 AM - Incident Detected**:
```
Alert: Database integrity check failed
Corrupted tables: households, population
Affected records: Unknown
Impact: System offline
```

**Actions**:
1. [ ] **Acknowledge Alert**
   - Record incident time: 09:00 AM
   - Severity: CRITICAL
   - Notify stakeholders

2. [ ] **Assess Damage**:
   ```sql
   -- Try to query affected tables
   SELECT count(*) FROM households;
   SELECT count(*) FROM population;
   -- Note error messages
   ```

3. [ ] **Determine Scope**:
   - Full database corruption or partial?
   - Can we use PITR or need full restore?
   - How much data will be lost?

**Decision Point**: Use yesterday's backup (max 24 hour data loss acceptable)

---

### Phase 2: Communication (2 minutes)

**9:05 AM - Notify Stakeholders**

**Template Email/SMS**:
```
URGENT: PNG Census Database Issue

Status: Database corruption detected
Impact: System offline, no data entry possible
Action: Restoring from backup
Expected Recovery: 30 minutes
Data Loss: Maximum 24 hours of data

Next Update: 09:30 AM

Technical Team
```

**Send to**:
- [ ] Project Manager
- [ ] Electoral Commissioner
- [ ] All supervisors
- [ ] IT Director

---

### Phase 3: Execute Recovery (15 minutes)

**9:07 AM - Begin Restoration**

1. [ ] **Download Latest Backup**:
   ```bash
   # From S3 (faster if large database)
   aws s3 cp s3://png-census-backups-2025/backups/LATEST/backup.dump.gz .
   gunzip backup.dump.gz
   ```

2. [ ] **Prepare Clean Database**:
   - Option A: Use PITR to roll back to before corruption
   - Option B: Full restore from backup

3. [ ] **Execute Restore**:
   ```bash
   pg_restore \
     -h db.usipijjyqfpxmhjbebyo.supabase.co \
     -U postgres \
     -d postgres \
     -c \
     -v \
     backup.dump
   ```

4. [ ] **Monitor Progress**:
   - Watch for errors
   - Note completion percentage
   - ETA: 10-15 minutes

**9:22 AM - Restore Completed**

---

### Phase 4: Verification (5 minutes)

**9:22 AM - Verify Database Integrity**

1. [ ] **Check Table Counts**:
   ```sql
   SELECT
     (SELECT count(*) FROM households) as households,
     (SELECT count(*) FROM population) as population,
     (SELECT count(*) FROM voters) as voters,
     (SELECT count(*) FROM user_profiles) as users;
   ```

2. [ ] **Verify Recent Data**:
   ```sql
   -- Check latest registrations
   SELECT max(created_at) FROM households;
   SELECT max(created_at) FROM population;
   -- Should be from yesterday (24 hour loss)
   ```

3. [ ] **Test Critical Functions**:
   - [ ] Can login
   - [ ] Can view census dashboard
   - [ ] Can register new household
   - [ ] Charts display correctly

4. [ ] **Rebuild Indexes**:
   ```sql
   REINDEX DATABASE postgres;
   ANALYZE;
   ```

**9:27 AM - Verification Complete**

---

### Phase 5: Recovery & Communication (3 minutes)

**9:27 AM - System Back Online**

1. [ ] **Enable System Access**:
   - Remove maintenance mode
   - Allow user logins

2. [ ] **Send All-Clear**:
   ```
   RESOLVED: PNG Census Database Restored

   Status: System ONLINE
   Restoration Time: 27 minutes
   Data Loss: ~18 hours (October 11, 3PM - October 12, 9AM)
   Next Steps: Enumerators re-enter affected data

   System fully operational. Resume normal operations.

   Technical Team
   ```

3. [ ] **Post-Incident Report**:
   - Total downtime: 27 minutes
   - Root cause: Database corruption (investigate further)
   - Data loss: 18 hours
   - Lessons learned: PITR would have been faster
   - Actions: Daily backups working as designed

**9:30 AM - DR Drill Complete**

**✅ Recovery Time Objective (RTO) MET**: 30 minutes
**✅ Recovery Point Objective (RPO) MET**: 24 hours

---

## 📋 Backup Configuration Checklist

### ✅ Supabase Backups Configured

- [ ] Daily automated backups enabled (7-day retention)
- [ ] Weekly automated backups enabled (28-day retention)
- [ ] Point-in-Time Recovery (PITR) enabled
- [ ] Manual backup tested successfully
- [ ] Restore from Supabase backup tested
- [ ] PITR tested with specific timestamp

### ✅ Off-Site Backups (Optional)

- [ ] AWS S3 bucket created and configured
- [ ] IAM user created with appropriate permissions
- [ ] Lifecycle policy set (90-day Glacier transition)
- [ ] Backup script created and tested
- [ ] Cron job scheduled for weekly off-site backup
- [ ] Restore from S3 tested successfully

### ✅ Disaster Recovery

- [ ] DR plan documented (DATABASE_BACKUP_RECOVERY.md)
- [ ] DR drill conducted successfully
- [ ] RTO verified: < 4 hours ✓
- [ ] RPO verified: < 24 hours ✓
- [ ] Contact list updated
- [ ] Stakeholder notification templates ready

### ✅ Monitoring & Alerts

- [ ] Backup success/failure monitoring set up
- [ ] Email alerts for failed backups
- [ ] Monthly backup verification scheduled
- [ ] Quarterly full restore test scheduled

---

## 📊 Backup Status Dashboard

**Create a simple tracking sheet**:

| Metric | Target | Current Status | Last Checked |
|--------|--------|----------------|--------------|
| Daily Backup | Enabled | ✅ | Oct 12, 2025 |
| Weekly Backup | Enabled | ✅ | Oct 12, 2025 |
| PITR | Enabled | ✅ | Oct 12, 2025 |
| Latest Backup | < 24 hours old | 6 hours ago ✅ | Oct 12, 2025 |
| Off-Site Backup | Weekly | Last: Oct 8 ✅ | Oct 12, 2025 |
| Last Restore Test | Quarterly | Sep 28, 2025 ✅ | Oct 12, 2025 |
| RTO | < 4 hours | 27 min ✅ | Oct 12 (drill) |
| RPO | < 24 hours | 18 hours ✅ | Oct 12 (drill) |

---

## 📞 Emergency Contacts

**Database Issues**:
- Supabase Support: support@supabase.com
- Internal DBA: [Contact]

**AWS Issues**:
- AWS Support: [Account support number]

**Escalation**:
1. System Administrator → Database Admin → CTO → Electoral Commissioner

---

## 🎓 Training Requirements

**System Administrator must be trained on**:
- [ ] Creating manual backups
- [ ] Restoring from backup via Supabase Dashboard
- [ ] Using Point-in-Time Recovery
- [ ] Running off-site backup script
- [ ] Restoring from S3 backup
- [ ] DR drill procedures

---

## 📆 Ongoing Maintenance Schedule

### Daily
- [ ] Monitor backup completion (automated alert)

### Weekly
- [ ] Verify off-site backup completed
- [ ] Check S3 bucket storage usage
- [ ] Review backup logs

### Monthly
- [ ] Test restore from latest backup (to dev environment)
- [ ] Verify backup file integrity
- [ ] Review and update DR documentation

### Quarterly
- [ ] Full disaster recovery drill
- [ ] Review RTO/RPO objectives
- [ ] Update contact lists
- [ ] Audit backup access controls

### Annually
- [ ] Review and update backup retention policies
- [ ] Evaluate new backup technologies
- [ ] Cost analysis (storage costs vs. needs)
- [ ] Security audit of backup systems

---

## ✅ SIGN-OFF

**Backup Configuration Completed By**: _________________
**Date**: __________
**Verified By**: _________________
**Date**: __________

**System Ready for Production**: [ ] YES [ ] NO

**If NO, Outstanding Items**: _________________________________

---

**🇵🇬 Data Protection = Mission Protection**

**Backups configured? ✅**
**DR tested? ✅**
**System protected? ✅**

**Ready for October 13-15, 2025 Workshop!**
