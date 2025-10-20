# PNG Population & Housing Census System Documentation

## Overview

The PNG Population & Housing Census System is a comprehensive digital platform for conducting a nationwide population census in Papua New Guinea. Built following international standards (UN Principles and Recommendations, WHO guidelines, Washington Group Disability Statistics), this system provides disability-inclusive, all-ages registration with biometric capabilities.

---

## System Features

### 1. **Comprehensive Population Coverage**
- **All Ages Registration**: From newborns to elderly citizens
- **Household-based Enumeration**: Captures household composition and dwelling characteristics
- **Individual Demographics**: Detailed personal information for every citizen
- **NID Integration Ready**: Can pull data from PNG NID or register new citizens

### 2. **Disability-Inclusive Data Collection**
Following **Washington Group Short Set (WG-SS)** questions:
- **Seeing**: Difficulty seeing, even with glasses
- **Hearing**: Difficulty hearing, even with hearing aid
- **Walking**: Difficulty walking or climbing steps
- **Remembering**: Difficulty remembering or concentrating
- **Self-care**: Difficulty with washing or dressing
- **Communicating**: Difficulty communicating or being understood

**Disability Identification**: Person classified as having a disability if they report "A lot of difficulty" or "Cannot do at all" in ANY domain.

### 3. **International Standards Compliance**

#### UN Census Principles
- Complete enumeration of population
- Individual enumeration within households
- Universal coverage of territory
- Defined reference period
- Simultaneity of enumeration
- Periodicity (every 10 years)

#### Data Categories Collected
1. **Geographic**: Province, District, LLG/Ward, Village/Settlement, GPS coordinates
2. **Demographic**: Age, sex, marital status, relationship to household head
3. **Cultural**: Ethnicity, religion, languages spoken
4. **Education**: Literacy, school attendance, highest level attained
5. **Economic**: Employment status, occupation, industry sector
6. **Migration**: Place of birth, migration status, years at residence
7. **Disability**: Washington Group 6 questions + disability types
8. **Health**: Health insurance, chronic illness, vaccination status
9. **Housing**: Dwelling type, construction materials, amenities
10. **Utilities**: Water source, sanitation, electricity, cooking fuel

---

## Database Schema

### Households Table
Stores household-level data including dwelling characteristics and infrastructure.

```typescript
interface HouseholdData {
  // Identification
  household_number: string
  enumeration_area: string

  // Location
  province: string
  district: string
  llg_ward: string
  village_settlement: string
  latitude?: number
  longitude?: number

  // Dwelling Characteristics
  dwelling_type: 'Traditional' | 'Modern' | 'Semi-permanent' | 'Temporary' | 'Other'
  wall_material: string
  roof_material: string
  floor_material: string
  number_of_rooms: number
  owns_dwelling: boolean

  // Basic Services
  water_source: string
  toilet_facility: string
  electricity_source: string
  cooking_fuel: string

  // Census Management
  total_members: number
  household_head_id?: string
  enumerator_id: string
  enumeration_date: string
  verification_status: 'pending' | 'verified' | 'rejected'
  data_quality_score: number
}
```

### Population Table
Stores individual-level data for all persons (all ages, disability-inclusive).

```typescript
interface PopulationData {
  // Identification
  census_id: string
  household_id: string
  nid_number?: string
  birth_certificate_number?: string

  // Demographics
  full_name: string
  date_of_birth: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  relationship_to_head: string
  marital_status: string
  place_of_birth: string
  nationality: string
  ethnicity?: string
  religion?: string
  languages_spoken: string[]

  // Education
  literacy_status: 'Literate' | 'Illiterate' | 'Partially literate'
  highest_education: string
  current_school_attendance: boolean

  // Employment
  employment_status: string
  occupation?: string
  industry_sector?: string

  // Migration
  migration_status: 'Resident' | 'Migrant' | 'Visitor'
  previous_residence?: string
  years_at_current_residence: number

  // WASHINGTON GROUP DISABILITY QUESTIONS
  difficulty_seeing: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_hearing: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_walking: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_remembering: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_selfcare: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_communicating: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  has_disability: boolean
  disability_type?: string[]
  receives_disability_support: boolean

  // Health
  health_insurance: boolean
  chronic_illness?: string[]
  vaccination_status?: string

  // Biometric Data
  photo_url?: string
  fingerprint_template?: string
  iris_scan_template?: string
  biometric_quality_score?: number

  // Data Management
  data_source: 'census' | 'nid' | 'birth_registration' | 'manual'
  is_verified: boolean
  verification_date?: string
  verifier_id?: string
  enumeration_area: string
  enumerator_id: string
  enumeration_date: string
}
```

---

## Census Workflow

### Phase 1: Enumeration Area Setup
1. Define enumeration areas (EAs) by province, district, LLG/Ward
2. Assign enumerators to specific EAs
3. Estimate population and households per EA
4. Map EA boundaries and accessibility

### Phase 2: Household Enumeration
1. **Visit Household**: Enumerator visits each household in assigned EA
2. **Capture GPS**: Record precise location coordinates
3. **Register Household**:
   - Household number (unique identifier)
   - Dwelling characteristics
   - Construction materials
   - Access to basic services
4. **Generate Household ID**: System creates unique household identifier

### Phase 3: Population Enumeration
For **each member** of the household:

1. **Basic Demographics**
   - Full name, date of birth, age, gender
   - Relationship to household head
   - Marital status
   - Place of birth, nationality, ethnicity, religion

2. **Education & Employment**
   - Literacy status
   - Highest education level
   - Current school attendance (if applicable)
   - Employment status and occupation

3. **Disability Assessment (Washington Group)**
   - Ask all 6 functional difficulty questions
   - Record specific responses
   - System auto-calculates disability status
   - Capture disability types if applicable

4. **Health Information**
   - Health insurance coverage
   - Chronic illnesses
   - Vaccination status

5. **Migration Data**
   - Migration status (Resident/Migrant/Visitor)
   - Years at current residence
   - Previous residence location

6. **Biometric Capture** (Optional)
   - Photograph
   - Fingerprints
   - Iris scan (if equipment available)

### Phase 4: Data Quality Control
1. **Field Validation**: Real-time validation during data entry
2. **Supervisor Verification**: Review by field supervisors
3. **Central Validation**: Statistical validation at central level
4. **Data Cleaning**: Identify and resolve inconsistencies

### Phase 5: Data Analysis & Reporting
1. **Demographic Analysis**: Population pyramids, age-sex distributions
2. **Disability Statistics**: Prevalence rates by type and severity
3. **Socio-Economic Indicators**: Education, employment, housing
4. **Geographic Distribution**: Provincial and district breakdowns
5. **Accessibility Mapping**: Infrastructure and services coverage

---

## Key Census Indicators

### Demographic Indicators
- Total population
- Population by age group (0-4, 5-14, 15-24, 25-54, 55-64, 65+)
- Sex ratio
- Average household size
- Dependency ratio
- Population density

### Disability Indicators
- **Prevalence of Disability**: Percentage with "A lot of difficulty" or "Cannot do at all"
- **By Domain**:
  - Seeing difficulty rate
  - Hearing difficulty rate
  - Walking/mobility difficulty rate
  - Cognitive difficulty rate
  - Self-care difficulty rate
  - Communication difficulty rate
- **By Demographics**: Age, sex, location breakdowns
- **Multiple Disabilities**: Persons with difficulties in multiple domains
- **Support Access**: Percentage receiving disability services

### Socio-Economic Indicators
- Literacy rate (ages 15+)
- School attendance rate (ages 5-18)
- Employment rate (ages 15-64)
- Unemployment rate
- Labor force participation rate
- Economic dependency ratio

### Housing Indicators
- Households by dwelling type
- Access to improved water sources
- Access to improved sanitation
- Access to electricity
- Cooking fuel types
- Homeownership rate

---

## Benefits of This System

### 1. **Electoral Roll Foundation**
- Complete population database for electoral registration
- Age verification for voting eligibility
- Address verification for polling station assignment
- Biometric deduplication to prevent multiple registrations

### 2. **National Planning**
- Accurate population counts for resource allocation
- Infrastructure needs assessment
- Education planning (school-age population)
- Healthcare planning (disability prevalence, health needs)

### 3. **Disability Inclusion**
- Identify persons with disabilities for targeted support
- Plan accessible services and infrastructure
- Monitor disability rights implementation
- Evidence for disability policy development

### 4. **Development Monitoring**
- Track progress on SDG indicators
- Monitor universal access to services
- Measure educational attainment
- Assess employment and economic participation

### 5. **NID System Integration**
- Can verify citizens against NID database
- Register citizens not yet in NID system
- Export census data to populate NID database
- Foundation for unified citizen registry

---

## Data Privacy & Security

### Privacy Protections
- Individual records confidential
- Only statistical aggregates published
- Personal identifiers removed from public data
- Strict access controls for enumeration staff

### Security Measures
- Encrypted data transmission
- Secure cloud storage (Supabase)
- Role-based access control
- Audit trail of all data access
- Biometric data stored separately with encryption

### Legal Framework
- Complies with PNG Privacy laws
- Statistics Act provisions
- International data protection standards

---

## Technical Implementation

### Technology Stack
- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Realtime, Auth)
- **Biometrics**: Face-API.js, fingerprint capture libraries
- **Mapping**: Leaflet with PNG province boundaries
- **Offline**: Service workers, IndexedDB for offline enumeration
- **Languages**: English, Tok Pisin (i18next)

### Deployment
- Static export for CDN deployment
- Real-time sync with central database
- Offline-first for remote areas
- Progressive Web App (PWA) capabilities

---

## Usage Instructions

### For Enumerators

1. **Login**: Access system with enumerator credentials
2. **Select EA**: Choose assigned enumeration area
3. **Start Household**:
   - Click "Census Registration"
   - Choose "Household Registration"
   - Fill household form
   - Capture GPS location
   - Submit household

4. **Add Household Members**:
   - After household registration, add each member
   - Complete all sections for each person
   - Pay special attention to Washington Group questions
   - Capture biometrics if equipment available
   - Submit each person

5. **Review & Verify**: Check data completeness before moving to next household

### For Supervisors

1. **Monitor Progress**: Track enumeration progress by EA
2. **Quality Control**: Review flagged records
3. **Verify Data**: Approve or reject household registrations
4. **Support Enumerators**: Resolve data issues

### For Administrators

1. **EA Management**: Create and assign enumeration areas
2. **User Management**: Create enumerator and supervisor accounts
3. **Data Export**: Generate reports and statistics
4. **System Monitoring**: Track data quality and completeness

---

## Census Statistics Dashboard

Access real-time census statistics:

- **Population Overview**: Total, by sex, age groups
- **Disability Dashboard**: Prevalence rates, types, support coverage
- **Education Stats**: Literacy, attendance, attainment
- **Employment Stats**: Labor force, employment, unemployment
- **Housing Stats**: Dwelling types, amenities, services
- **Geographic Distribution**: Provincial and district breakdowns
- **Interactive Maps**: Visualize data spatially

---

## Future Enhancements

1. **Mobile App**: Native Android/iOS apps for enumerators
2. **Offline Maps**: Pre-loaded maps for remote enumeration
3. **Tablet Optimization**: Better UI for tablet devices
4. **Satellite Imagery**: Integrate satellite data for EA mapping
5. **AI Data Validation**: Machine learning for data quality
6. **Voice Input**: Voice-to-text for local languages
7. **Extended Disability Set**: Washington Group Extended Set questions
8. **Child Functioning Module**: Disability questions for children 2-17

---

## Support & Training

### Training Materials
- Enumerator handbook (PDF)
- Video tutorials
- Practice scenarios
- FAQs

### Technical Support
- Help desk: census-support@pngelectoralsystem.pg
- WhatsApp support group
- Field supervisor assistance

---

## References

1. **UN Principles and Recommendations for Population and Housing Censuses (Revision 3)**
   - https://unstats.un.org/unsd/demographic-social/Standards-and-Methods/

2. **Washington Group on Disability Statistics**
   - https://www.washingtongroup-disability.com/

3. **WHO International Classification of Functioning, Disability and Health (ICF)**
   - https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health

4. **PNG National Statistics Office**
   - https://www.nso.gov.pg/

---

## Contact

**PNG Electoral Commission**
Digital Electoral Transformation System
Email: info@pngelectoralsystem.pg
Workshop: October 13-15, 2025 • Hilton Hotel, Port Moresby

---

**🇵🇬 Building Papua New Guinea's Digital Future - One Citizen at a Time**
