# Pre-Workshop Test Execution
## Critical Tests Before October 13-15, 2025 Workshop

**Test Duration**: 1-2 hours
**Priority**: HIGH - Must complete before workshop
**Tester**: Technical team

---

## 🎯 Testing Objectives

Verify the **20 most critical features** that will be demonstrated in the workshop:

1. ✅ All 4 demo accounts can login
2. ✅ Role-based access control works
3. ✅ Enumerator can register households offline
4. ✅ Census data visualizations display correctly
5. ✅ PDF/Excel exports generate successfully

---

## 🔐 CRITICAL TEST SET 1: Authentication (MUST PASS)

### Test 1.1: Administrator Login ✓
**Priority**: CRITICAL

1. Go to `/login`
2. Enter: `admin@demo.pg` / `demo123`
3. Click Sign In
4. ✅ **PASS**: Redirects to `/` or appropriate dashboard
5. ❌ **FAIL**: Shows error or doesn't redirect

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

### Test 1.2: Analyst Login ✓
1. Logout
2. Login as: `analyst@demo.pg` / `demo123`
3. ✅ **PASS**: Redirects to `/census-dashboard`
4. Verify can see charts and data

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

### Test 1.3: Supervisor Login ✓
1. Logout
2. Login as: `supervisor@demo.pg` / `demo123`
3. ✅ **PASS**: Redirects to `/census-monitoring`
4. Verify can see enumeration areas

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

### Test 1.4: Enumerator Login ✓
1. Logout
2. Login as: `enumerator@demo.pg` / `demo123`
3. ✅ **PASS**: Redirects to `/enumerator`
4. Verify session dashboard visible

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

## 🚧 CRITICAL TEST SET 2: Route Protection (MUST PASS)

### Test 2.1: Enumerator Access Restrictions ✓

**Logged in as Enumerator** (`enumerator@demo.pg`):

1. Try accessing `/census-monitoring`
2. ✅ **PASS**: Redirected to `/enumerator` (blocked)
3. Try accessing `/census-dashboard`
4. ✅ **PASS**: Redirected to `/enumerator` (blocked)

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

### Test 2.2: Supervisor Access ✓

**Logged in as Supervisor** (`supervisor@demo.pg`):

1. Access `/census-monitoring`
2. ✅ **PASS**: Can view dashboard
3. Access `/household-management`
4. ✅ **PASS**: Can view households
5. Try accessing `/census-dashboard`
6. ✅ **PASS**: Should be blocked

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

### Test 2.3: Administrator Full Access ✓

**Logged in as Administrator** (`admin@demo.pg`):

1. Access `/enumerator` - Should work ✓
2. Access `/census-monitoring` - Should work ✓
3. Access `/census-dashboard` - Should work ✓
4. Access `/household-management` - Should work ✓
5. ✅ **PASS**: All routes accessible

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

## 🏠 CRITICAL TEST SET 3: Census Registration (MUST PASS)

### Test 3.1: Household Registration ✓

**Login as Enumerator**, then:

1. Go to `/enumerator`
2. Click **"Register New Household"**
3. Fill in household form:
   - Household Number: `TEST-HH-001`
   - Province: `National Capital District`
   - District: `Moresby North-East`
   - LLG/Ward: `Hohola Ward 2`
   - Village: `Test Village`
   - Dwelling Type: `Modern`
   - Number of Rooms: `4`
   - Water Source: `Piped water`
   - Toilet: `Flush toilet`
   - Electricity: `Grid connection`
   - Cooking Fuel: `LPG`
4. Click **"Capture GPS"** (allow location access)
5. Submit household
6. ✅ **PASS**: Household created, success message shown
7. ❌ **FAIL**: Error message or form doesn't submit

**Status**: [ ] Pass [ ] Fail
**GPS Captured**: [ ] Yes [ ] No
**Notes**: _________________________________

---

### Test 3.2: Population Registration with Disability Questions ✓

**After creating household in Test 3.1**:

1. Click **"Add Household Member"** or navigate to population form
2. Fill in member information:
   - Full Name: `Test Household Head`
   - Date of Birth: `1980-05-15` (should show age 45)
   - Gender: `Male`
   - Relationship to Head: `Head`
   - Marital Status: `Married`
   - Place of Birth: `Port Moresby`
   - Nationality: `Papua New Guinean`
   - Literacy: `Literate`
   - Education: `Secondary education`
   - Employment Status: `Employed`

3. **CRITICAL: Washington Group Disability Questions**:
   - Seeing: `No difficulty`
   - Hearing: `No difficulty`
   - Walking: `Some difficulty`
   - Remembering: `No difficulty`
   - Self-care: `No difficulty`
   - Communicating: `No difficulty`

4. Submit member
5. ✅ **PASS**: Member created successfully
6. Verify `has_disability` = false (no "a lot" or "cannot do")

**Register Second Member with Disability**:
1. Add another member (spouse)
2. Fill basic info
3. Washington Group Questions:
   - Seeing: `A lot of difficulty` ← **This triggers disability**
   - (Fill rest as "No difficulty")
4. Submit
5. ✅ **PASS**: Member created, `has_disability` = true

**Status**: [ ] Pass [ ] Fail
**Disability Flag Correct**: [ ] Yes [ ] No
**Notes**: _________________________________

---

## 📴 CRITICAL TEST SET 4: Offline Functionality (MUST PASS)

### Test 4.1: Offline Registration ✓

**Still logged in as Enumerator**:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Set throttling to **"Offline"**
4. Verify offline badge appears (red badge at top)
5. Try to register a new household:
   - Household Number: `OFFLINE-HH-001`
   - Fill basic fields
   - Submit
6. ✅ **PASS**: Shows "Pending Upload" status
7. Check **"Pending Uploads"** counter incremented
8. Set network back to **"Online"**
9. Click **"Sync"** button
10. ✅ **PASS**: Data syncs, counter goes to 0
11. Verify household appears in database

**Status**: [ ] Pass [ ] Fail
**Sync Successful**: [ ] Yes [ ] No
**Notes**: _________________________________

---

## 📊 CRITICAL TEST SET 5: Supervisor Dashboard (MUST PASS)

### Test 5.1: Census Monitoring Dashboard ✓

**Login as Supervisor** (`supervisor@demo.pg`):

1. Navigate to `/census-monitoring`
2. Verify displays:
   - [ ] Overall progress card (completion %, total EAs, population)
   - [ ] Status distribution pie chart
   - [ ] Enumeration area cards with progress bars
   - [ ] Data quality scores
3. Check if alerts appear:
   - [ ] Behind schedule alert (if any EA <50% and in progress)
   - [ ] Low quality alert (if any EA quality <75%)
   - [ ] Ready for verification (if any EA completed)
4. ✅ **PASS**: Dashboard loads and displays all components
5. ❌ **FAIL**: Charts don't load or errors appear

**Status**: [ ] Pass [ ] Fail
**Charts Load**: [ ] Yes [ ] No
**Notes**: _________________________________

---

### Test 5.2: Household Management ✓

**Still as Supervisor**:

1. Navigate to `/household-management`
2. Search for household created in Test 3.1: `TEST-HH-001`
3. Click on the household
4. Verify displays:
   - [ ] Household details (dwelling, GPS, etc.)
   - [ ] Member roster (2 members from Test 3.2)
   - [ ] Family composition summary
5. Click **"Edit"** on a member
6. Modify name or age
7. Save changes
8. ✅ **PASS**: Changes saved successfully
9. Click **"Export Household Data"**
10. ✅ **PASS**: Excel file downloads

**Status**: [ ] Pass [ ] Fail
**Export Works**: [ ] Yes [ ] No
**Notes**: _________________________________

---

## 📈 CRITICAL TEST SET 6: Data Visualization (MUST PASS)

### Test 6.1: Census Dashboard Charts ✓

**Login as Analyst** (`analyst@demo.pg`):

1. Navigate to `/census-dashboard`
2. Verify all 5 charts display:
   - [ ] Population by Age Group (bar chart)
   - [ ] Population by Gender (pie chart)
   - [ ] Disability by Functional Domain (radar chart)
   - [ ] Households by Dwelling Type (bar chart)
   - [ ] Access to Basic Services (bar chart)
3. Verify summary statistics display:
   - [ ] Total Population
   - [ ] Total Households
   - [ ] Average Household Size
   - [ ] Persons with Disability
4. Verify key indicators:
   - [ ] Literacy Rate
   - [ ] School Attendance Rate
   - [ ] Employment Rate
   - [ ] Disability Prevalence
5. ✅ **PASS**: All charts and stats display correctly
6. ❌ **FAIL**: Charts missing or show errors

**Status**: [ ] Pass [ ] Fail
**All Charts Visible**: [ ] Yes [ ] No
**Notes**: _________________________________

---

### Test 6.2: Provincial Filtering ✓

**Still on census dashboard**:

1. Click **"Filter by Province"** dropdown
2. Select **"National Capital District"**
3. Watch all charts update
4. Verify indicators recalculate
5. Select **"All Provinces"**
6. Verify reset to national data
7. ✅ **PASS**: Filtering works smoothly

**Status**: [ ] Pass [ ] Fail
**Notes**: _________________________________

---

## 📄 CRITICAL TEST SET 7: Export Functions (MUST PASS)

### Test 7.1: PDF Export ✓

**Still as Analyst on `/census-dashboard`**:

1. Click **"Export PDF Report"** button
2. Wait for generation (5-10 seconds)
3. PDF should auto-download
4. Open the PDF file
5. Verify contains:
   - [ ] Summary statistics
   - [ ] All 5 charts (as images)
   - [ ] PNG Electoral Commission branding
   - [ ] Professional formatting
6. ✅ **PASS**: PDF generates with all content
7. ❌ **FAIL**: PDF doesn't download or missing content

**Status**: [ ] Pass [ ] Fail
**PDF Opens**: [ ] Yes [ ] No
**Notes**: _________________________________

---

### Test 7.2: Excel Export ✓

**Still on census dashboard**:

1. Click **"Export to Excel"** button
2. Excel file should download
3. Open the Excel file
4. Verify contains multiple sheets:
   - [ ] Summary sheet with key statistics
   - [ ] Age Distribution sheet
   - [ ] Disability Data sheet
   - [ ] Housing Statistics sheet
5. Verify data is properly formatted
6. ✅ **PASS**: Excel file complete with all sheets
7. ❌ **FAIL**: File doesn't download or data missing

**Status**: [ ] Pass [ ] Fail
**Excel Opens**: [ ] Yes [ ] No
**Notes**: _________________________________

---

## 🗳️ CRITICAL TEST SET 8: Voter Registration (MUST PASS)

### Test 8.1: PNG NID Lookup ✓

**Login as Administrator or use public registration page**:

1. Navigate to `/register`
2. Enter NID Number: `PNG12345678` (demo account)
3. Click **"Lookup NID"**
4. ✅ **PASS**: Citizen information displays
5. Verify shows:
   - Full Name: John Kila
   - Date of Birth, Gender, Province, etc.
6. Proceed to Step 2 (biometric capture)

**Status**: [ ] Pass [ ] Fail
**Data Displays**: [ ] Yes [ ] No
**Notes**: _________________________________

---

### Test 8.2: Biometric Capture ✓

**Continuing from Test 8.1**:

1. In Step 2, click **"Capture Photo"**
2. Allow camera access
3. Take a photo
4. Verify photo displays
5. Check quality score appears (should be 60-100%)
6. Continue to Step 3 (polling station selection)
7. Select polling station
8. Submit registration
9. ✅ **PASS**: Registration successful
10. ❌ **FAIL**: If error or duplicate detected (expected if testing multiple times)

**Status**: [ ] Pass [ ] Fail
**Photo Captured**: [ ] Yes [ ] No
**Quality Score**: _____%
**Notes**: _________________________________

---

## 📱 CRITICAL TEST SET 9: Mobile Interface (MUST PASS)

### Test 9.1: Tablet View ✓

**Test on tablet or DevTools mobile emulation**:

1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select **iPad Air** or **iPad Pro**
4. Navigate to `/enumerator` as enumerator
5. Verify:
   - [ ] Large touch-friendly buttons
   - [ ] Bottom navigation bar visible
   - [ ] All text readable on tablet
   - [ ] Forms easy to fill on touch screen
6. Try rotating to landscape
7. ✅ **PASS**: Interface adapts well to tablet
8. Try registering a household on tablet view

**Status**: [ ] Pass [ ] Fail
**Touch-Friendly**: [ ] Yes [ ] No
**Notes**: _________________________________

---

## 🔍 CRITICAL TEST SET 10: GPS Functionality (MUST PASS)

### Test 10.1: GPS Capture ✓

**As Enumerator on `/enumerator`**:

1. When registering a household, click **"Capture GPS"**
2. Browser should request location permission
3. Allow location access
4. Wait for GPS lock (10-30 seconds)
5. Verify latitude and longitude display
6. Check coordinates are reasonable:
   - Latitude: around -9.4 (for Port Moresby)
   - Longitude: around 147.1
7. ✅ **PASS**: GPS coordinates captured
8. ❌ **FAIL**: GPS doesn't work or shows wrong location

**Status**: [ ] Pass [ ] Fail
**Coordinates**: Lat: _______ Lon: _______
**Accuracy**: _______ meters
**Notes**: _________________________________

---

## 🌐 CRITICAL TEST SET 11: Multilingual Support (OPTIONAL)

### Test 11.1: Language Switching ✓

1. Click language switcher in header
2. Select **"Tok Pisin"**
3. Verify UI text translates
4. Navigate between pages
5. Verify language persists
6. Switch back to **"English"**
7. ✅ **PASS**: Language switching works

**Status**: [ ] Pass [ ] Fail (Optional)
**Notes**: _________________________________

---

## 📋 TEST EXECUTION SUMMARY

### Overall Results

**Total Critical Tests**: 20
**Tests Passed**: ___ / 20
**Tests Failed**: ___ / 20
**Pass Rate**: ____%

**MINIMUM ACCEPTABLE**: 18/20 (90%)

### Failed Tests (if any)

| Test ID | Test Name | Failure Reason | Fix Required |
|---------|-----------|----------------|--------------|
| | | | |
| | | | |

### Critical Blockers (Must Fix Before Workshop)

1. **Blocker #1**: _________________________________
   - **Impact**: _________________________________
   - **Fix**: _________________________________

2. **Blocker #2**: _________________________________
   - **Impact**: _________________________________
   - **Fix**: _________________________________

---

## ✅ SIGN-OFF

**Tested By**: _________________ **Date**: _______
**Reviewed By**: _________________ **Date**: _______

**Ready for Workshop**: [ ] YES [ ] NO

**If NO, reason**: _________________________________

---

## 🚨 Emergency Contact

If critical tests fail and you need immediate support:

**Technical Support**: support@same.new
**Workshop Lead**: [Contact info]

---

## 📊 Test Execution Checklist

Quick reference - mark each as you complete:

- [ ] Test Set 1: Authentication (4 tests)
- [ ] Test Set 2: Route Protection (3 tests)
- [ ] Test Set 3: Census Registration (2 tests)
- [ ] Test Set 4: Offline Functionality (1 test)
- [ ] Test Set 5: Supervisor Dashboard (2 tests)
- [ ] Test Set 6: Data Visualization (2 tests)
- [ ] Test Set 7: Export Functions (2 tests)
- [ ] Test Set 8: Voter Registration (2 tests)
- [ ] Test Set 9: Mobile Interface (1 test)
- [ ] Test Set 10: GPS Functionality (1 test)
- [ ] Test Set 11: Multilingual (1 test - optional)

**Total**: 20 critical tests + 1 optional

---

**🇵🇬 System Ready When All Critical Tests Pass!**

**Target Completion**: October 12, 2025 (day before workshop)
**Workshop Dates**: October 13-15, 2025
**Venue**: Hilton Hotel, Port Moresby
