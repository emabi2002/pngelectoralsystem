# PNG NID Integration & Electoral Roll System

## Overview

The PNG Electoral Registration System is a production system that integrates with the Papua New Guinea National Identification (PNG NID) System to manage the electoral roll. This system enables seamless voter registration by leveraging existing citizen data from the PNG NID database.

## System Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Electoral Search Request                    │
│              (NID Number or Fingerprint)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Search Electoral Roll DB     │
         │  (Local Database)             │
         └───────┬───────────────────────┘
                 │
         ┌───────▼───────┐
         │  Found?       │
         └───┬───────┬───┘
             │       │
         YES │       │ NO
             │       │
             ▼       ▼
    ┌────────────┐  ┌──────────────────────┐
    │ Display    │  │ Query PNG NID API    │
    │ Voter Data │  │ (External System)    │
    └────────────┘  └──────┬───────────────┘
                           │
                    ┌──────▼──────┐
                    │  Found?     │
                    └──┬───────┬──┘
                       │       │
                   YES │       │ NO
                       │       │
                       ▼       ▼
         ┌─────────────────┐  ┌──────────────────┐
         │ Import to       │  │ Manual           │
         │ Electoral Roll  │  │ Registration     │
         └─────────────────┘  │ Required         │
                              └──────────────────┘
```

## Key Features

### 1. Comprehensive Search Workflow

The system implements a three-tier search workflow:

1. **Electoral Roll Search**: First searches the local electoral roll database
2. **PNG NID Query**: If not found locally, queries the PNG NID system via API
3. **Registration Flow**: Based on results, either imports from NID or allows manual registration

### 2. Search Methods

- **NID Number Search**: Search by PNG National ID number
- **Fingerprint Search**: Biometric search using fingerprint templates

### 3. Data Synchronization

- Seamless import from PNG NID to electoral roll
- Maintains data source tracking (PNG NID vs. Manual Registration)
- Automatic verification status for NID-sourced records

## Database Schema

### Electoral Roll Table

```sql
CREATE TABLE electoral_roll (
  id UUID PRIMARY KEY,
  nid_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  llg_ward TEXT NOT NULL,
  polling_station TEXT,
  registration_date TIMESTAMPTZ NOT NULL,
  photo_url TEXT,
  fingerprint_data TEXT,
  signature_data TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  source TEXT NOT NULL, -- 'png_nid' or 'manual_registration'
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

## API Integration

### PNG NID API Endpoints

The system integrates with the following PNG NID API endpoints:

#### 1. Search by NID Number
```
GET /citizens/search/nid/{nidNumber}
Authorization: Bearer {API_KEY}
```

#### 2. Search by Fingerprint
```
POST /citizens/search/fingerprint
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "fingerprint_template": "..."
}
```

### Configuration

Set up PNG NID API credentials in `.env.local`:

```env
NEXT_PUBLIC_PNG_NID_API_URL=https://api.pngnid.gov.pg/v1
NEXT_PUBLIC_PNG_NID_API_KEY=your_api_key_here
```

## Usage Guide

### For Electoral Officers

#### Registering a New Voter

1. **Navigate to Electoral Search**
   - Go to "Electoral Roll Search" from the main dashboard

2. **Choose Search Method**
   - Option A: Enter NID Number
   - Option B: Capture Fingerprint

3. **Review Search Results**

   **Scenario 1: Found in Electoral Roll**
   - System displays existing voter record
   - Verify information is current
   - Update if needed

   **Scenario 2: Found in PNG NID, Not in Electoral Roll**
   - System displays citizen data from PNG NID
   - Review information
   - Click "Import to Electoral Roll"
   - Voter is automatically registered

   **Scenario 3: Not Found Anywhere**
   - System indicates citizen not found
   - Click "Go to Voter Registration"
   - Complete manual registration form
   - Record saved with source = 'manual_registration'

### For System Administrators

#### Database Setup

1. **Run SQL Schema**
   ```bash
   psql -h your-db-host -U postgres -d your-database -f database/electoral_roll_schema.sql
   ```

2. **Verify Table Creation**
   ```sql
   SELECT * FROM electoral_roll LIMIT 1;
   ```

3. **Check Indexes**
   ```sql
   \d electoral_roll
   ```

#### Monitoring

- **Electoral Roll Statistics View**
  ```sql
  SELECT * FROM electoral_roll_stats;
  ```

  Provides breakdown by:
  - Province and District
  - Total voters
  - Active/Inactive/Deceased/Suspended
  - Source (NID vs Manual)
  - Verification status
  - Gender distribution

## Data Privacy & Security

### Biometric Data Protection

- Fingerprint data stored as encrypted templates
- Templates cannot be reverse-engineered to recreate actual fingerprints
- Access controlled via Row Level Security (RLS)

### API Security

- All PNG NID API calls use Bearer token authentication
- API keys stored securely in environment variables
- Never exposed to client-side code

### Audit Trail

- All electoral roll changes tracked with timestamps
- Source of data (PNG NID vs Manual) permanently recorded
- User ID of registration officer recorded

## Integration Testing

### Test Scenarios

1. **NID Search - Existing in Both Systems**
   - Search NID: PNG123456789
   - Expected: Found in electoral roll

2. **NID Search - Only in PNG NID**
   - Search NID: PNG987654321
   - Expected: Found in PNG NID, offer import

3. **NID Search - Not Found**
   - Search NID: PNG000000000
   - Expected: Not found, manual registration required

4. **Fingerprint Search**
   - Capture fingerprint
   - Expected: Match found or not found workflow

## API Service Implementation

The `pngNidApiService` provides the following methods:

```typescript
// Search PNG NID by NID number
await pngNidApiService.searchByNidNumber(nidNumber)

// Search PNG NID by fingerprint
await pngNidApiService.searchByFingerprint(fingerprintTemplate)

// Search electoral roll by NID
await pngNidApiService.searchElectoralRollByNid(nidNumber)

// Search electoral roll by fingerprint
await pngNidApiService.searchElectoralRollByFingerprint(fingerprintData)

// Import from PNG NID to electoral roll
await pngNidApiService.importToElectoralRoll(nidCitizen, pollingStation)

// Manual registration
await pngNidApiService.manualRegistration(voterData)

// Comprehensive search (all sources)
await pngNidApiService.comprehensiveSearch({ nidNumber, fingerprintTemplate })
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] PNG NID API credentials configured
- [ ] Database schema deployed
- [ ] Indexes created for performance
- [ ] Row Level Security policies enabled
- [ ] Backup procedures established
- [ ] Monitoring and logging configured

### Environment Variables

Required for production:
```env
NEXT_PUBLIC_PNG_NID_API_URL=https://api.pngnid.gov.pg/v1
NEXT_PUBLIC_PNG_NID_API_KEY=<production_key>
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
```

## Support

For technical support:
- System Issues: Contact IT Support Team
- PNG NID API Issues: Contact PNG NID System Administrator
- Database Issues: Contact Database Administrator

## Roadmap

### Planned Enhancements

- [ ] Real-time biometric matching integration
- [ ] Bulk import from PNG NID
- [ ] Automated duplicate detection
- [ ] Mobile app for field registration
- [ ] SMS notification to voters upon registration
- [ ] Integration with polling station management system

## Version History

- **v2.0** - Production electoral roll system with PNG NID integration
- **v1.0** - Workshop demonstration system

---

**Last Updated**: October 2025
**System Status**: Production
**Integration Status**: PNG NID API Connected
