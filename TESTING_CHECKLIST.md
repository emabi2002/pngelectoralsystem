# Production Testing Checklist
## PNG Digital Electoral System

**Version 10.0 | October 2025**

---

## 🎯 Testing Objectives

- ✅ Verify all features work as expected
- ✅ Ensure data integrity and security
- ✅ Test offline functionality
- ✅ Validate role-based access control
- ✅ Confirm export capabilities
- ✅ Test under realistic load conditions
- ✅ Verify mobile/tablet responsiveness

---

## 🔐 Authentication & Authorization Testing

### Login Functionality
- [ ] **Test Valid Login** (all 4 roles)
  - [ ] Enumerator: `enumerator@demo.pg` / `demo123`
  - [ ] Supervisor: `supervisor@demo.pg` / `demo123`
  - [ ] Analyst: `analyst@demo.pg` / `demo123`
  - [ ] Administrator: `admin@demo.pg` / `demo123`
  - ✅ **Expected**: Successful login, redirect to role-appropriate page

- [ ] **Test Invalid Login**
  - [ ] Wrong password
  - [ ] Non-existent email
  - [ ] Inactive account
  - ✅ **Expected**: Clear error message, no access granted

- [ ] **Test Password Reset**
  - [ ] Enter valid email
  - [ ] Check reset email received
  - [ ] Click reset link
  - [ ] Set new password
  - [ ] Login with new password
  - ✅ **Expected**: Password successfully reset, can login

- [ ] **Test Session Management**
  - [ ] Login and wait 24 hours
  - [ ] Login on multiple devices simultaneously
  - [ ] Logout and verify session cleared
  - ✅ **Expected**: Session expires properly, logout works

### Role-Based Access Control (RBAC)
- [ ] **Enumerator Access**
  - [ ] Can access: `/enumerator`, `/census`, `/register`
  - [ ] Cannot access: `/census-monitoring`, `/census-dashboard`, admin routes
  - ✅ **Expected**: Proper access restrictions enforced

- [ ] **Supervisor Access**
  - [ ] Can access: `/census-monitoring`, `/household-management`
  - [ ] Can view data in assigned province only
  - [ ] Cannot access: `/census-dashboard`, administrator functions
  - ✅ **Expected**: Province-level data isolation

- [ ] **Analyst Access**
  - [ ] Can access: `/census-dashboard`, view all data
  - [ ] Cannot edit data
  - [ ] Can export reports
  - ✅ **Expected**: Read-only access to all data

- [ ] **Administrator Access**
  - [ ] Can access all routes
  - [ ] Can manage users
  - [ ] Can edit any data
  - ✅ **Expected**: Full system access

---

## 👥 Voter Registration System

### PNG NID Lookup Flow
- [ ] **Valid NID Lookup**
  - [ ] Enter NID: `PNG12345678`
  - [ ] Click "Lookup NID"
  - [ ] Verify citizen data displayed
  - [ ] Proceed to biometric capture
  - ✅ **Expected**: Citizen info auto-populated

- [ ] **Invalid NID Lookup**
  - [ ] Enter non-existent NID
  - [ ] Verify "Not Found" message
  - [ ] Option to register new citizen shown
  - ✅ **Expected**: Graceful handling, new registration option

### New Citizen Registration
- [ ] **Complete Citizen Form**
  - [ ] Fill all required fields
  - [ ] Submit form
  - [ ] Verify citizen record created
  - [ ] Verify NID number generated
  - ✅ **Expected**: New citizen successfully registered

- [ ] **Form Validation**
  - [ ] Leave required fields blank
  - [ ] Enter invalid email format
  - [ ] Enter invalid phone format
  - [ ] Enter birth date making person <18
  - ✅ **Expected**: Proper validation errors shown

### Biometric Capture
- [ ] **Facial Image Capture**
  - [ ] Click "Capture Photo"
  - [ ] Allow camera access
  - [ ] Take photo
  - [ ] Verify photo displayed
  - [ ] Check quality score calculated
  - ✅ **Expected**: Photo captured, quality scored

- [ ] **Duplicate Detection**
  - [ ] Register same person twice
  - [ ] Verify duplicate detected via face matching
  - [ ] Error message shown with match confidence
  - ✅ **Expected**: Duplicate prevented

### Electoral Roll Registration
- [ ] **Complete Voter Registration**
  - [ ] Select polling station
  - [ ] Confirm details
  - [ ] Submit registration
  - [ ] Verify voter record created
  - ✅ **Expected**: Voter added to electoral roll

- [ ] **Duplicate Voter Check**
  - [ ] Try registering same NID twice
  - [ ] Verify error message
  - ✅ **Expected**: Duplicate prevented

---

## 🏘️ Census System Testing

### Household Registration
- [ ] **New Household Registration**
  - [ ] Fill household form
  - [ ] Capture GPS coordinates
  - [ ] Submit household
  - [ ] Verify household ID generated
  - ✅ **Expected**: Household created successfully

- [ ] **GPS Capture**
  - [ ] Click "Capture GPS"
  - [ ] Allow location access
  - [ ] Verify coordinates captured
  - [ ] Check coordinates are within PNG boundaries
  - ✅ **Expected**: Accurate GPS recorded

- [ ] **Dwelling Characteristics**
  - [ ] Select dwelling type
  - [ ] Enter construction materials
  - [ ] Select basic services
  - [ ] Verify all saved correctly
  - ✅ **Expected**: All household data saved

### Population Registration
- [ ] **Register Household Members**
  - [ ] Add household head
  - [ ] Add spouse
  - [ ] Add children
  - [ ] Verify relationships correct
  - ✅ **Expected**: All members registered

- [ ] **All Ages Registration**
  - [ ] Register infant (<1 year)
  - [ ] Register child (5-17 years)
  - [ ] Register adult (18-64 years)
  - [ ] Register elderly (65+ years)
  - ✅ **Expected**: System handles all ages

- [ ] **Washington Group Disability Questions**
  - [ ] Answer all 6 questions
  - [ ] Select "A lot of difficulty" for one
  - [ ] Verify `has_disability` flag set to true
  - [ ] Select "No difficulty" for all
  - [ ] Verify `has_disability` flag set to false
  - ✅ **Expected**: Disability correctly calculated

- [ ] **Biometric Capture (Census)**
  - [ ] Capture photo for each member
  - [ ] Capture fingerprints (optional)
  - [ ] Verify biometric quality scores
  - ✅ **Expected**: Biometrics stored

---

## 📊 Census Monitoring (Supervisor Dashboard)

### Progress Tracking
- [ ] **View Enumeration Areas**
  - [ ] See all assigned EAs
  - [ ] Check status distribution
  - [ ] Verify progress percentages
  - ✅ **Expected**: Accurate EA status displayed

- [ ] **Alert System**
  - [ ] Verify "Behind Schedule" alert for <50% complete EA
  - [ ] Verify "Low Quality" alert for <75% quality score
  - [ ] Verify "Ready for Verification" alert for completed EA
  - ✅ **Expected**: Alerts displayed correctly

- [ ] **Daily Progress Charts**
  - [ ] View cumulative household registrations
  - [ ] View population registration trend
  - [ ] Verify charts update with new data
  - ✅ **Expected**: Real-time chart updates

### Filtering
- [ ] **Province Filter**
  - [ ] Select specific province
  - [ ] Verify only EAs in that province shown
  - [ ] Verify statistics recalculated
  - ✅ **Expected**: Correct filtering

---

## 🏠 Household Management

### Household Search & View
- [ ] **Search Functionality**
  - [ ] Search by household number
  - [ ] Search by village name
  - [ ] Verify results displayed
  - ✅ **Expected**: Search works correctly

- [ ] **Household Details**
  - [ ] Select a household
  - [ ] View full household info
  - [ ] View all members
  - [ ] View family composition summary
  - ✅ **Expected**: Complete household data shown

### Member Management
- [ ] **Add Member**
  - [ ] Click "Add Member"
  - [ ] Fill member form
  - [ ] Submit
  - [ ] Verify member added to roster
  - ✅ **Expected**: Member successfully added

- [ ] **Edit Member**
  - [ ] Click "Edit" on a member
  - [ ] Modify information
  - [ ] Save changes
  - [ ] Verify changes persisted
  - ✅ **Expected**: Member updated

- [ ] **Delete Member**
  - [ ] Click "Delete" on a member
  - [ ] Confirm deletion
  - [ ] Verify member removed
  - [ ] Verify household member count updated
  - ✅ **Expected**: Member deleted, counts updated

---

## 📈 Census Data Visualization

### Charts
- [ ] **Population by Age Group (Bar Chart)**
  - [ ] Verify all age groups displayed
  - [ ] Hover to see exact counts
  - [ ] Check data accuracy
  - ✅ **Expected**: Accurate age distribution shown

- [ ] **Gender Distribution (Pie Chart)**
  - [ ] Verify male/female/other slices
  - [ ] Check percentages add to 100%
  - [ ] Verify counts match database
  - ✅ **Expected**: Correct gender breakdown

- [ ] **Disability by Domain (Radar Chart)**
  - [ ] Verify all 6 domains shown
  - [ ] Check prevalence percentages
  - [ ] Compare to expected Washington Group patterns
  - ✅ **Expected**: Proper disability visualization

- [ ] **Dwelling Types (Bar Chart)**
  - [ ] Verify all dwelling types shown
  - [ ] Check counts accurate
  - ✅ **Expected**: Correct housing data

- [ ] **Basic Services (Bar Chart)**
  - [ ] Verify water, sanitation, electricity, cooking fuel
  - [ ] Check percentages
  - ✅ **Expected**: Infrastructure data correct

### Indicators
- [ ] **Literacy Rate**
  - [ ] Verify calculation: (Literate 15+ / Total 15+) × 100
  - [ ] Check value reasonable (40-90%)
  - ✅ **Expected**: Accurate literacy rate

- [ ] **School Attendance Rate**
  - [ ] Verify calculation: (In school 5-18 / Total 5-18) × 100
  - [ ] Check value reasonable (60-95%)
  - ✅ **Expected**: Accurate attendance rate

- [ ] **Employment Rate**
  - [ ] Verify calculation: (Employed 15-64 / Total 15-64) × 100
  - [ ] Check value reasonable (30-70%)
  - ✅ **Expected**: Accurate employment rate

- [ ] **Disability Prevalence**
  - [ ] Verify calculation: (Has disability / Total) × 100
  - [ ] Check value reasonable (10-20%)
  - ✅ **Expected**: Accurate disability rate

### Provincial Filtering
- [ ] **Filter by Province**
  - [ ] Select each province
  - [ ] Verify all charts update
  - [ ] Verify indicators recalculate
  - [ ] Select "All Provinces"
  - [ ] Verify reset to national data
  - ✅ **Expected**: Filtering works across all components

---

## 📥 Export Functionality

### PDF Export
- [ ] **Census Dashboard PDF**
  - [ ] Click "Export PDF Report"
  - [ ] Wait for generation
  - [ ] Open PDF file
  - [ ] Verify:
    - [ ] Summary statistics present
    - [ ] All charts rendered
    - [ ] Tables formatted properly
    - [ ] PNG Electoral Commission branding
    - [ ] Multi-page if needed
  - ✅ **Expected**: Professional PDF generated

### Excel Export
- [ ] **Census Dashboard Excel**
  - [ ] Click "Export to Excel"
  - [ ] Open workbook
  - [ ] Verify sheets:
    - [ ] Summary sheet with indicators
    - [ ] Age distribution sheet
    - [ ] Disability data sheet
    - [ ] Housing statistics sheet
  - [ ] Verify data accuracy
  - ✅ **Expected**: Complete Excel workbook

- [ ] **Household Data Excel**
  - [ ] Go to Household Management
  - [ ] Click "Export Household Data"
  - [ ] Open file
  - [ ] Verify all household records present
  - [ ] Verify all fields included
  - ✅ **Expected**: Complete household export

---

## 📱 Mobile/Tablet Enumerator Interface

### Interface Testing
- [ ] **Tablet Optimized Layout**
  - [ ] Open `/enumerator` on tablet (or simulate in DevTools)
  - [ ] Verify large touch targets
  - [ ] Verify bottom navigation visible
  - [ ] Test landscape and portrait modes
  - ✅ **Expected**: Touch-friendly interface

- [ ] **Session Dashboard**
  - [ ] View today's progress
  - [ ] Check population registered count
  - [ ] Verify session start time displayed
  - [ ] Check progress bar updates
  - ✅ **Expected**: Accurate session tracking

### Offline Functionality
- [ ] **Enable Offline Mode**
  - [ ] Open DevTools → Network
  - [ ] Set to "Offline"
  - [ ] Verify offline indicator shows (red badge)
  - ✅ **Expected**: System detects offline status

- [ ] **Register Household Offline**
  - [ ] Fill household form
  - [ ] Capture GPS
  - [ ] Submit
  - [ ] Verify "Pending Upload" status
  - [ ] Check pending counter increments
  - ✅ **Expected**: Data saved locally

- [ ] **Register Population Offline**
  - [ ] Add household members
  - [ ] Complete all fields
  - [ ] Submit
  - [ ] Verify stored locally
  - ✅ **Expected**: Members saved offline

- [ ] **Sync Data Online**
  - [ ] Re-enable network
  - [ ] Click "Sync" button
  - [ ] Verify pending uploads process
  - [ ] Check "All data synced" message
  - [ ] Verify data in database
  - ✅ **Expected**: Automatic sync on reconnect

### GPS Tracking
- [ ] **Capture Location**
  - [ ] Click "Refresh Location"
  - [ ] Grant location permission
  - [ ] Verify lat/long displayed
  - [ ] Verify GPS enabled badge shows
  - ✅ **Expected**: Accurate coordinates captured

---

## 🗺️ Interactive Map Functionality

### Map Display
- [ ] **Load PNG Map**
  - [ ] Navigate to results/dashboard with map
  - [ ] Verify map loads
  - [ ] Verify all 22 provinces visible
  - ✅ **Expected**: PNG map rendered

- [ ] **Province Interactions**
  - [ ] Click on a province
  - [ ] Verify popup with province data
  - [ ] Verify statistics displayed
  - [ ] Close popup
  - ✅ **Expected**: Interactive provinces

- [ ] **Color Coding**
  - [ ] Verify provinces colored by voter turnout or result
  - [ ] Check legend displayed
  - [ ] Verify color scheme makes sense
  - ✅ **Expected**: Proper color coding

---

## 🌐 Multilingual Support

### Language Switching
- [ ] **Switch to Tok Pisin**
  - [ ] Click language switcher
  - [ ] Select "Tok Pisin"
  - [ ] Verify all UI text translates
  - [ ] Navigate between pages
  - [ ] Verify language persists
  - ✅ **Expected**: Complete Tok Pisin translation

- [ ] **Switch to English**
  - [ ] Select "English"
  - [ ] Verify translation back
  - ✅ **Expected**: Complete English translation

- [ ] **Language Persistence**
  - [ ] Set language to Tok Pisin
  - [ ] Refresh page
  - [ ] Verify still in Tok Pisin
  - [ ] Close browser and reopen
  - [ ] Verify language saved
  - ✅ **Expected**: Language choice persists

---

## ⚡ Performance Testing

### Load Testing
- [ ] **Simulate Multiple Users**
  - [ ] Use 10 concurrent users
  - [ ] All registering households simultaneously
  - [ ] Monitor page load times
  - [ ] Check for errors
  - ✅ **Expected**: <3 second response times

- [ ] **Large Dataset**
  - [ ] Load dashboard with 10,000+ records
  - [ ] Measure chart rendering time
  - [ ] Test export with large data
  - ✅ **Expected**: Acceptable performance (<5s)

### Page Load Speed
- [ ] **Measure Load Times**
  - [ ] Home page: < 2 seconds
  - [ ] Census dashboard: < 3 seconds
  - [ ] Household management: < 3 seconds
  - ✅ **Expected**: Fast initial loads

### Network Resilience
- [ ] **Slow Connection Test**
  - [ ] DevTools → Network → Slow 3G
  - [ ] Navigate site
  - [ ] Verify graceful degradation
  - ✅ **Expected**: Still functional on slow network

---

## 🔒 Security Testing

### SQL Injection
- [ ] **Test Input Fields**
  - [ ] Enter `' OR '1'='1` in login
  - [ ] Enter SQL in search fields
  - [ ] Verify no database access
  - ✅ **Expected**: Inputs sanitized

### Cross-Site Scripting (XSS)
- [ ] **Test Script Injection**
  - [ ] Enter `<script>alert('XSS')</script>` in text fields
  - [ ] Verify no script execution
  - ✅ **Expected**: Scripts escaped

### Authentication Bypass
- [ ] **Test Unauthorized Access**
  - [ ] Logout
  - [ ] Try accessing `/census-monitoring` directly
  - [ ] Verify redirect to login
  - ✅ **Expected**: Protected routes secured

### Row-Level Security (RLS)
- [ ] **Test Data Isolation**
  - [ ] Login as Enumerator in EA-001
  - [ ] Try to access household in EA-002
  - [ ] Verify access denied
  - ✅ **Expected**: RLS policies enforced

---

## 📊 Data Integrity Testing

### Referential Integrity
- [ ] **Orphaned Records Check**
  ```sql
  -- Should return 0
  SELECT COUNT(*) FROM population p
  LEFT JOIN households h ON p.household_id = h.id
  WHERE h.id IS NULL;
  ```
  - ✅ **Expected**: No orphaned population records

- [ ] **Household Member Count**
  ```sql
  -- Should match
  SELECT h.id, h.total_members, COUNT(p.id) as actual_members
  FROM households h
  LEFT JOIN population p ON h.id = p.household_id
  GROUP BY h.id
  HAVING h.total_members != COUNT(p.id);
  ```
  - ✅ **Expected**: Counts match

### Data Validation
- [ ] **Age Consistency**
  ```sql
  -- Should return 0 - no children with university degrees
  SELECT COUNT(*) FROM population
  WHERE age < 18 AND highest_education = 'University degree';
  ```
  - ✅ **Expected**: Logical data only

- [ ] **Disability Flag Consistency**
  ```sql
  -- Verify disability auto-calculation
  SELECT COUNT(*) FROM population
  WHERE has_disability = false
  AND (
    difficulty_seeing IN ('A lot of difficulty', 'Cannot do at all')
    OR difficulty_hearing IN ('A lot of difficulty', 'Cannot do at all')
    -- ... check all 6 domains
  );
  ```
  - ✅ **Expected**: Flags consistent with answers

---

## 🎓 Workshop Demonstration Tests

### Demo Scenario 1: Field Enumerator
- [ ] Login as enumerator
- [ ] Navigate to enumerator dashboard
- [ ] Register a new household
- [ ] Capture GPS
- [ ] Add 4 household members (different ages)
- [ ] Answer disability questions
- [ ] Capture biometric photos
- [ ] Go offline
- [ ] Register another household
- [ ] Go online and sync
- [ ] Verify both households in database
- ✅ **Expected**: Smooth end-to-end workflow

### Demo Scenario 2: Supervisor
- [ ] Login as supervisor
- [ ] View census monitoring dashboard
- [ ] Check EA progress
- [ ] Investigate behind-schedule EA
- [ ] Navigate to household management
- [ ] Search for a household
- [ ] Edit a member's information
- [ ] Export household data
- ✅ **Expected**: Supervisor workflow complete

### Demo Scenario 3: Analyst
- [ ] Login as analyst
- [ ] View census dashboard
- [ ] Review all charts
- [ ] Filter by specific province
- [ ] Check indicator calculations
- [ ] Export PDF report
- [ ] Export Excel workbook
- [ ] Open files and verify quality
- ✅ **Expected**: Analysis workflow complete

---

## 📝 Bug Tracking

| # | Description | Severity | Status | Assigned To | Notes |
|---|-------------|----------|--------|-------------|-------|
| 1 | Example bug | Low/Med/High | Open/Fixed | Name | Details |

**Severity Levels**:
- **Critical**: System crash, data loss, security breach
- **High**: Major feature broken, workaround exists
- **Medium**: Minor feature issue, limited impact
- **Low**: Cosmetic issue, minor inconvenience

---

## ✅ Sign-Off

### Testing Team Sign-Off
- [ ] **Tester 1**: _________________ Date: _______
- [ ] **Tester 2**: _________________ Date: _______
- [ ] **QA Lead**: _________________ Date: _______

### Deployment Approval
- [ ] **System Administrator**: _________________ Date: _______
- [ ] **Project Manager**: _________________ Date: _______
- [ ] **Electoral Commissioner**: _________________ Date: _______

---

**All tests must pass before production deployment!**

**🇵🇬 Quality Assurance = Data Assurance**

---

**Version 10.0 | PNG Electoral Commission | October 2025**
