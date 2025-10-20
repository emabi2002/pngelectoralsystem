# Database Backup & Disaster Recovery Plan
## PNG Digital Electoral System

**Version 10.0 | October 2025**

---

## 📋 Overview

This document outlines the backup strategy and disaster recovery procedures for the PNG Digital Electoral System. It ensures data protection, business continuity, and rapid recovery from any data loss scenarios.

---

## 🎯 Backup Objectives

### Recovery Point Objective (RPO)
**Target**: Maximum 1 hour of data loss
**Implementation**: Continuous replication + hourly transaction log backups

### Recovery Time Objective (RTO)
**Target**: System operational within 4 hours
**Implementation**: Automated failover + documented recovery procedures

---

## 🗄️ Backup Strategy

### 1. Supabase Automated Backups

**Platform**: Supabase (PostgreSQL)

#### Daily Backups
- **Frequency**: Every 24 hours
- **Time**: 00:00 UTC (11:00 AM Port Moresby time)
- **Retention**: 7 days
- **Type**: Full database snapshot
- **Storage**: Supabase Cloud (encrypted)
- **Status**: Automatic (no manual intervention)

#### Weekly Backups
- **Frequency**: Every Sunday at 00:00 UTC
- **Retention**: 4 weeks (28 days)
- **Type**: Full database snapshot
- **Storage**: Supabase Cloud + External archive
- **Status**: Automatic

#### Point-in-Time Recovery (PITR)
- **Availability**: Last 7 days
- **Granularity**: Down to the second
- **Use Case**: Restore to exact moment before data corruption
- **Cost**: Included in Supabase Pro plan

---

### 2. On-Demand Backups

#### When to Create Manual Backups
- ✅ Before major system updates or migrations
- ✅ Before bulk data imports
- ✅ Before schema changes
- ✅ Before production deployments
- ✅ After major enumeration milestones

#### How to Create Manual Backup

**Via Supabase Dashboard**:
1. Log in to Supabase Dashboard
2. Go to Settings → Database
3. Click "Backups" tab
4. Click "Create Backup"
5. Add description (e.g., "Pre-deployment backup 2025-10-10")
6. Wait for completion (5-15 minutes depending on size)

**Via Command Line** (pg_dump):
```bash
# Full database backup
pg_dump \
  -h db.usipijjyqfpxmhjbebyo.supabase.co \
  -U postgres \
  -d postgres \
  -F c \ # Custom format (compressed)
  -f backup_$(date +%Y%m%d_%H%M%S).dump

# Specific tables only (census data)
pg_dump \
  -h db.usipijjyqfpxmhjbebyo.supabase.co \
  -U postgres \
  -d postgres \
  -t households \
  -t population \
  -t citizens \
  -F c \
  -f census_backup_$(date +%Y%m%d).dump

# SQL format (human-readable)
pg_dump \
  -h db.usipijjyqfpxmhjbebyo.supabase.co \
  -U postgres \
  -d postgres \
  -f backup_$(date +%Y%m%d).sql
```

**Credentials**: Use database password from Supabase Settings → Database → Connection String

---

### 3. Off-Site Backups

**Frequency**: Weekly (every Sunday)
**Storage**: External to Supabase for redundancy

#### Storage Locations
1. **AWS S3 Bucket** (Primary)
   - Bucket: `png-census-backups`
   - Region: `ap-southeast-2` (Sydney - closest to PNG)
   - Encryption: AES-256
   - Lifecycle: Transition to Glacier after 90 days

2. **Google Cloud Storage** (Secondary)
   - Bucket: `png-electoral-backups`
   - Region: `australia-southeast1`
   - Encryption: Google-managed

3. **Local Archive** (Tertiary)
   - Location: Electoral Commission office safe
   - Media: Encrypted external hard drive
   - Update: Monthly

#### Automated Off-Site Backup Script

**File**: `backup_to_s3.sh`

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/tmp/census_backups"
S3_BUCKET="s3://png-census-backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_HOST="db.usipijjyqfpxmhjbebyo.supabase.co"
DB_NAME="postgres"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
echo "Creating database backup..."
pg_dump \
  -h $DB_HOST \
  -U postgres \
  -d $DB_NAME \
  -F c \
  -f $BACKUP_DIR/backup_$DATE.dump

# Compress backup
echo "Compressing backup..."
gzip $BACKUP_DIR/backup_$DATE.dump

# Upload to S3
echo "Uploading to S3..."
aws s3 cp \
  $BACKUP_DIR/backup_$DATE.dump.gz \
  $S3_BUCKET/backups/$DATE/ \
  --storage-class STANDARD_IA

# Cleanup local files
rm -f $BACKUP_DIR/backup_$DATE.dump.gz

echo "Backup complete: $S3_BUCKET/backups/$DATE/"
```

**Schedule via Cron**:
```bash
# Run every Sunday at 2:00 AM
0 2 * * 0 /path/to/backup_to_s3.sh
```

---

## 📊 Backup Verification

### Monthly Verification Checklist
- [ ] Verify latest backup exists and is accessible
- [ ] Check backup file size (should be consistent with data volume)
- [ ] Test restore to development environment
- [ ] Verify data integrity after test restore
- [ ] Document any issues or anomalies

### Test Restore Procedure

**Quarterly Test** (Every 3 months):
1. Select a random backup from the past month
2. Restore to a separate test database
3. Run data integrity checks:
   ```sql
   -- Check table counts
   SELECT 'households' as table, COUNT(*) as count FROM households
   UNION ALL
   SELECT 'population', COUNT(*) FROM population
   UNION ALL
   SELECT 'citizens', COUNT(*) FROM citizens;

   -- Check for NULL required fields
   SELECT COUNT(*) as null_names FROM population WHERE full_name IS NULL;
   SELECT COUNT(*) as null_households FROM households WHERE household_number IS NULL;

   -- Verify relationships
   SELECT COUNT(*) as orphaned_population
   FROM population p
   LEFT JOIN households h ON p.household_id = h.id
   WHERE h.id IS NULL;
   ```
4. Verify application can connect and query
5. Document test results
6. Delete test database

---

## 🚨 Disaster Recovery Procedures

### Disaster Scenarios

#### Scenario 1: Accidental Data Deletion
**Severity**: Medium
**RPO**: <1 hour
**RTO**: <2 hours

**Recovery Steps**:
1. **Identify Scope**:
   - What was deleted?
   - When did deletion occur?
   - How many records affected?

2. **Use Point-in-Time Recovery**:
   ```sql
   -- Restore to 5 minutes before deletion
   -- Via Supabase Dashboard:
   -- Settings → Database → Backups → Point-in-Time Recovery
   -- Select timestamp: 2025-10-10 14:25:00 UTC
   ```

3. **Verify Recovery**:
   - Count restored records
   - Spot-check data quality
   - Run integrity checks

4. **Resume Operations**:
   - Notify users system is back
   - Monitor for additional issues

---

#### Scenario 2: Database Corruption
**Severity**: High
**RPO**: <24 hours
**RTO**: <4 hours

**Recovery Steps**:
1. **Assess Damage**:
   - Run database diagnostics
   - Identify corrupted tables/rows
   - Determine if partial or full restore needed

2. **Restore from Latest Backup**:
   ```bash
   # Download backup from S3
   aws s3 cp s3://png-census-backups/backups/latest/backup.dump.gz .

   # Decompress
   gunzip backup.dump.gz

   # Restore
   pg_restore \
     -h db.usipijjyqfpxmhjbebyo.supabase.co \
     -U postgres \
     -d postgres \
     -c \ # Clean (drop) existing objects first
     -v \ # Verbose output
     backup.dump
   ```

3. **Rebuild Indexes**:
   ```sql
   REINDEX DATABASE postgres;
   ANALYZE;
   ```

4. **Test Application**:
   - Login functionality
   - Data retrieval
   - Report generation
   - Exports

5. **Go Live**:
   - Notify stakeholders
   - Resume operations
   - Post-mortem analysis

---

#### Scenario 3: Complete Supabase Outage
**Severity**: Critical
**RPO**: <24 hours
**RTO**: <8 hours (includes migration time)

**Recovery Steps**:

**Phase 1: Assessment** (30 minutes)
- Check Supabase status page
- Verify outage is not local network issue
- Contact Supabase support
- Estimate downtime

**Phase 2: Decision** (30 minutes)
- If estimated fix >4 hours, proceed to failover
- If <4 hours, wait for Supabase recovery

**Phase 3: Failover to Alternative Provider** (2-3 hours)
1. Provision new PostgreSQL instance (AWS RDS or Google Cloud SQL)
2. Restore latest off-site backup:
   ```bash
   # Download from S3
   aws s3 cp s3://png-census-backups/backups/latest/backup.dump.gz .
   gunzip backup.dump.gz

   # Restore to new database
   pg_restore \
     -h new-db-host.rds.amazonaws.com \
     -U postgres \
     -d postgres \
     -v \
     backup.dump
   ```
3. Update application environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://new-postgres-proxy.com
   # Update API endpoints
   ```
4. Redeploy application with new database connection

**Phase 4: Testing** (1 hour)
- Test all critical functions
- Verify data integrity
- Load testing

**Phase 5: Go Live** (30 minutes)
- Switch DNS/routing to new deployment
- Monitor closely for issues
- Communicate status to users

**Phase 6: Post-Incident** (after Supabase recovery)
- Sync any new data to Supabase
- Migrate back if desired
- Update disaster recovery plan based on lessons learned

---

#### Scenario 4: Ransomware Attack
**Severity**: Critical
**RPO**: <24 hours
**RTO**: <12 hours

**Recovery Steps**:

**Phase 1: Containment** (Immediate)
1. **Disconnect Infected Systems**:
   - Isolate affected servers
   - Block network access
   - Disable user accounts

2. **Preserve Evidence**:
   - Do not delete anything
   - Screenshot ransom note
   - Note time of discovery
   - Contact law enforcement

**Phase 2: Assessment** (1-2 hours)
1. Identify scope of encryption
2. Determine if backups are also compromised
3. Assess if decryption key available (do NOT pay ransom)

**Phase 3: Recovery** (4-8 hours)
1. **Restore from Off-Site Backup**:
   - Use backup from BEFORE infection date
   - Verify backup is clean (scan for malware)
   - Restore to NEW, clean environment

2. **Rebuild Infrastructure**:
   - Fresh OS installs
   - Updated security patches
   - Harden configuration

3. **Restore Data**:
   ```bash
   # Use oldest known-clean backup
   aws s3 cp s3://png-census-backups/backups/20251008/backup.dump.gz .
   gunzip backup.dump.gz
   pg_restore -h new-clean-db -U postgres -d postgres backup.dump
   ```

**Phase 4: Security Hardening** (Ongoing)
- Change all passwords
- Audit all user accounts
- Enable 2FA for all users
- Review and tighten RLS policies
- Install endpoint protection
- Staff security training

**Phase 5: Investigation**
- Forensic analysis
- Identify attack vector
- Document timeline
- Implement additional controls

---

## 🔐 Backup Security

### Encryption
- **At Rest**: All backups encrypted with AES-256
- **In Transit**: TLS 1.3 for all data transfers
- **Keys**: Managed by Supabase and AWS KMS

### Access Control
- **Supabase Backups**: Admin role only
- **S3 Buckets**: IAM role with least privilege
- **Physical Media**: Stored in locked safe, access log

### Compliance
- **Data Privacy**: No PII in backup file names or logs
- **Retention Policy**: Align with PNG data protection laws
- **Audit Trail**: All backup operations logged

---

## 📅 Backup Schedule Summary

| Backup Type | Frequency | Retention | Location | Purpose |
|-------------|-----------|-----------|----------|---------|
| Supabase Daily | Daily | 7 days | Supabase Cloud | Quick recovery |
| Supabase Weekly | Weekly | 28 days | Supabase Cloud | Medium-term recovery |
| PITR | Continuous | 7 days | Supabase Cloud | Precise recovery |
| Off-Site S3 | Weekly | 90 days (then Glacier) | AWS S3 | Disaster recovery |
| Off-Site GCS | Weekly | 90 days | Google Cloud | DR redundancy |
| Physical Archive | Monthly | Indefinite | Electoral Office | Long-term archive |
| Manual/On-Demand | As needed | Varies | Multiple | Pre-change safety |

---

## 🧪 Testing Schedule

| Test Type | Frequency | Scope | Documentation |
|-----------|-----------|-------|---------------|
| Restore Verification | Monthly | Single table restore | Test log |
| Full Restore Test | Quarterly | Complete database | Test report |
| Disaster Recovery Drill | Semi-annually | Full DR scenario | DR exercise report |
| Security Audit | Annually | Backup access controls | Audit report |

---

## 📞 Emergency Contacts

### Internal
- **System Administrator**: [Admin Name] - [Phone]
- **Database Admin**: [DBA Name] - [Phone]
- **Security Officer**: [Security Name] - [Phone]
- **Management**: [Manager Name] - [Phone]

### External
- **Supabase Support**: support@supabase.com
- **AWS Support**: [Account support number]
- **Cybersecurity Incident Response**: [CERT PNG]

### Escalation Path
1. System Administrator (Tier 3)
2. Database Administrator
3. Chief Technology Officer
4. Electoral Commissioner

---

## 📝 Incident Documentation Template

After any recovery operation, document:

**Incident Report - [Date]**

1. **Incident Summary**:
   - What happened?
   - When was it discovered?
   - Who discovered it?

2. **Impact Assessment**:
   - Data affected
   - Users affected
   - Downtime duration

3. **Recovery Actions**:
   - Backup used
   - Recovery steps taken
   - Time to restore

4. **Root Cause**:
   - Why did it happen?
   - Was it preventable?

5. **Lessons Learned**:
   - What went well?
   - What could be improved?
   - Changes to implement

6. **Follow-Up Actions**:
   - Preventive measures
   - Process improvements
   - Training needs

---

## 🎓 Staff Training

### Backup Administrator Training
- Creating manual backups
- Verifying backup integrity
- Restoring from backup
- Off-site backup management

### All Staff Awareness
- Importance of backups
- Data handling procedures
- Incident reporting
- Security best practices

---

## 🔄 Maintenance & Updates

### Quarterly Review
- [ ] Update backup procedures if needed
- [ ] Review and test recovery time
- [ ] Update contact information
- [ ] Review storage capacity
- [ ] Audit backup access logs

### Annual Review
- [ ] Full disaster recovery drill
- [ ] Review and update RPO/RTO targets
- [ ] Evaluate new backup technologies
- [ ] Cost-benefit analysis of backup strategy
- [ ] Update disaster recovery plan

---

## 📚 References

- [Supabase Backup Documentation](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL Backup & Recovery](https://www.postgresql.org/docs/current/backup.html)
- [AWS S3 Disaster Recovery](https://aws.amazon.com/disaster-recovery/)

---

**🇵🇬 Data Protection = Mission Protection**

Reliable backups ensure PNG's census data is always protected and recoverable.

---

**Version 10.0 | PNG Electoral Commission | October 2025**

**Document Owner**: System Administrator
**Last Updated**: October 10, 2025
**Next Review**: January 10, 2026
