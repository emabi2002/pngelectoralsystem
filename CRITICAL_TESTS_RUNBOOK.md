# Critical Tests Runbook - Pre-Workshop Verification
## PNG Digital Electoral System

**Run Date**: _____________
**Tester**: _____________
**Version**: 11
**Status**: [ ] PASS [ ] FAIL

---

## 🎯 Purpose

This runbook contains the **most critical tests** to run before the October 13-15 workshop to ensure all key features work correctly. Complete these tests in order.

**Estimated Time**: 45-60 minutes

---

## ✅ Pre-Test Checklist

Before starting tests:
- [ ] Demo accounts created in Supabase (all 4 users)
- [ ] System accessible at production URL
- [ ] Browser DevTools open (for debugging)
- [ ] Have test devices ready (desktop + tablet if possible)
- [ ] Internet connection stable

---

## TEST GROUP 1: Authentication & Authorization (15 minutes)

### Test 1.1: Administrator Login ⭐ CRITICAL
**Steps**:
1. Navigate to `/login`
2. Enter: `admin@demo.pg` / `demo123`
3. Click "Sign In"

**Expected Result**:
- [ ] Successful login
- [ ] Redirects to `/` (home page)
- [ ] Can see all navigation options
- [ ] No errors in console

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 1.2: Analyst Login & Redirect ⭐ CRITICAL
**Steps**:
1. Logout from admin
2. Login as: `analyst@demo.pg` / `demo123`

**Expected Result**:
- [ ] Successful login
- [ ] Redirects to `/census-dashboard`
- [ ] Dashboard loads with charts
- [ ] No access to admin functions

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 1.3: Supervisor Login & Province Access
**Steps**:
1. Logout
2. Login as: `supervisor@demo.pg` / `demo123`

**Expected Result**:
- [ ] Redirects to `/census-monitoring`
- [ ] Can access household management
- [ ] Province filter shows "National Capital District"

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 1.4: Enumerator Login & EA Access
**Steps**:
1. Logout
2. Login as: `enumerator@demo.pg` / `demo123`

**Expected Result**:
- [ ] Redirects to `/enumerator`
- [ ] Shows EA-NCD-001 assignment
- [ ] Session dashboard visible
- [ ] GPS tracking section visible

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 1.5: Route Protection ⭐ CRITICAL
**Steps**:
1. While logged in as enumerator
2. Try to navigate to `/census-monitoring` directly
3. Try to navigate to `/census-dashboard` directly

**Expected Result**:
- [ ] Redirects back to `/enumerator`
- [ ] No access to restricted routes
- [ ] Error message or auto-redirect

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

## TEST GROUP 2: Census System (20 minutes)

### Test 2.1: Household Registration ⭐ CRITICAL
**Steps** (as enumerator):
1. Click "Register New Household"
2. Fill in household form:
   - Household Number: `HH-TEST-001`
   - Province: `National Capital District`
   - District: `Moresby North-East`
   - LLG/Ward: `Hohola Ward 2`
   - Village: `Test Village`
   - Dwelling Type: `Modern`
   - Rooms: `4`
   - Wall: `Concrete`
   - Roof: `Iron sheets`
   - Floor: `Tiles`
   - Water Source: `Piped water`
   - Toilet: `Flush toilet`
   - Electricity: `Grid connection`
   - Cooking: `LPG`
   - Owns Dwelling: `Yes`
3. Click "Capture GPS" (or enter manually: -9.4438, 147.1803)
4. Submit

**Expected Result**:
- [ ] Form validates correctly
- [ ] GPS captures (if allowed) or manual entry works
- [ ] Household created successfully
- [ ] Shows success message
- [ ] Redirects to add members

**Status**: [ ] PASS [ ] FAIL
**Household ID Created**: ___________________________

---

### Test 2.2: Population Registration with Disability Questions ⭐ CRITICAL
**Steps**:
1. Add household head:
   - Name: `Test Household Head`
   - DOB: `1975-05-15`
   - Gender: `Male`
   - Relationship: `Head`
   - Marital Status: `Married`
   - Place of Birth: `Port Moresby`
   - Nationality: `Papua New Guinean`
   - Languages: `English, Tok Pisin`
   - Literacy: `Literate`
   - Education: `Secondary education`
   - In School: `No`
   - Employment: `Employed`
   - Occupation: `Teacher`

2. **WASHINGTON GROUP QUESTIONS** (answer for each):
   - Seeing: `No difficulty`
   - Hearing: `No difficulty`
   - Walking: `No difficulty`
   - Remembering: `No difficulty`
   - Self-care: `No difficulty`
   - Communicating: `No difficulty`

3. Submit member

**Expected Result**:
- [ ] All fields save correctly
- [ ] Washington Group questions all answered
- [ ] `has_disability` flag = false (all "No difficulty")
- [ ] Member appears in household roster
- [ ] Age calculated correctly (49 years)

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 2.3: Disability Detection ⭐ CRITICAL
**Steps**:
1. Add another member (child with disability):
   - Name: `Test Child`
   - DOB: `2015-03-10`
   - Gender: `Female`
   - Relationship: `Daughter`
   - Marital Status: `Single`

2. **WASHINGTON GROUP - Set ONE to "A lot of difficulty"**:
   - Seeing: `A lot of difficulty` ← IMPORTANT
   - Hearing: `No difficulty`
   - Walking: `No difficulty`
   - Remembering: `No difficulty`
   - Self-care: `No difficulty`
   - Communicating: `No difficulty`

3. Submit

**Expected Result**:
- [ ] `has_disability` flag = TRUE (because of seeing)
- [ ] Member saved with disability status
- [ ] System correctly identifies disability

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

## TEST GROUP 3: Supervisor Features (10 minutes)

### Test 3.1: Census Monitoring Dashboard ⭐ CRITICAL
**Steps**:
1. Logout, login as supervisor
2. Go to `/census-monitoring`
3. Review dashboard

**Expected Result**:
- [ ] Overall progress metrics displayed
- [ ] Status distribution pie chart renders
- [ ] Enumeration area cards visible
- [ ] Data quality scores showing
- [ ] No loading errors

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 3.2: Household Management ⭐ CRITICAL
**Steps**:
1. Navigate to `/household-management`
2. Search for household: `HH-TEST-001`
3. Click on the household

**Expected Result**:
- [ ] Household details displayed
- [ ] Both members (head + child) visible
- [ ] Child shows disability status
- [ ] Family composition summary correct
- [ ] GPS coordinates displayed

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

## TEST GROUP 4: Data Visualization & Export (10 minutes)

### Test 4.1: Census Dashboard Charts ⭐ CRITICAL
**Steps**:
1. Logout, login as analyst
2. Go to `/census-dashboard`
3. Review all charts

**Expected Result**:
- [ ] Population by age group chart loads
- [ ] Gender distribution pie chart loads
- [ ] Disability radar chart loads
- [ ] Dwelling types chart loads
- [ ] Basic services chart loads
- [ ] Summary statistics calculated
- [ ] Key indicators displayed

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 4.2: PDF Export ⭐ CRITICAL
**Steps**:
1. On census dashboard
2. Click "Export PDF Report"
3. Wait for generation
4. Open PDF file

**Expected Result**:
- [ ] PDF generates without error
- [ ] Contains summary statistics
- [ ] Charts rendered as images
- [ ] Tables formatted properly
- [ ] PNG Electoral Commission branding visible
- [ ] Professional appearance

**Status**: [ ] PASS [ ] FAIL
**PDF Quality**: [ ] Excellent [ ] Good [ ] Poor

---

### Test 4.3: Excel Export
**Steps**:
1. Click "Export to Excel"
2. Open workbook

**Expected Result**:
- [ ] Excel file downloads
- [ ] Multiple sheets present (Summary, Age, Disability, Housing)
- [ ] Data populated correctly
- [ ] Headers formatted

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

## TEST GROUP 5: Mobile/Offline Features (10 minutes)

### Test 5.1: Offline Mode ⭐ CRITICAL
**Steps**:
1. Login as enumerator
2. Go to `/enumerator`
3. Open DevTools → Network tab
4. Set to "Offline"
5. Try to register a new household

**Expected Result**:
- [ ] Offline indicator shows (red badge)
- [ ] Can still fill household form
- [ ] Form submission stores locally
- [ ] "Pending Uploads" counter increments
- [ ] No crash or error

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 5.2: Sync When Back Online ⭐ CRITICAL
**Steps**:
1. Re-enable network (Online mode)
2. Click "Sync" button

**Expected Result**:
- [ ] Pending data uploads automatically
- [ ] "All data synced" message appears
- [ ] Data visible in database
- [ ] Pending counter resets to 0

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

### Test 5.3: Tablet Interface (if tablet available)
**Steps**:
1. Open `/enumerator` on tablet
2. Review interface

**Expected Result**:
- [ ] Large touch targets
- [ ] Bottom navigation visible
- [ ] Easy to tap buttons
- [ ] Landscape and portrait work
- [ ] Text readable

**Status**: [ ] PASS [ ] FAIL [ ] N/A (no tablet)
**Notes**: ___________________________

---

## TEST GROUP 6: Voter Registration (5 minutes)

### Test 6.1: PNG NID Lookup
**Steps**:
1. Go to `/register`
2. Enter NID: `PNG12345678`
3. Click "Lookup NID"

**Expected Result**:
- [ ] Citizen information displays
- [ ] Name: John Kila
- [ ] Shows full details from NID
- [ ] "Proceed to Registration" button enabled

**Status**: [ ] PASS [ ] FAIL
**Notes**: ___________________________

---

## 📊 FINAL SUMMARY

**Total Tests Run**: _____ / 20
**Tests Passed**: _____
**Tests Failed**: _____
**Pass Rate**: _____%

### Critical Issues Found:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Minor Issues Found:
1. ___________________________________________
2. ___________________________________________

### Action Items Before Workshop:
- [ ] Fix critical issues (if any)
- [ ] Retest failed tests
- [ ] Verify all demo accounts work
- [ ] Prepare backup demo plan (in case of internet failure)

---

## ✅ GO/NO-GO DECISION

**Minimum Requirements for Workshop**:
- [ ] All authentication tests pass (Tests 1.1-1.5)
- [ ] Census registration works (Tests 2.1-2.3)
- [ ] Supervisor dashboard loads (Test 3.1)
- [ ] At least one export works (Test 4.2 or 4.3)
- [ ] Offline mode works (Test 5.1)

**Decision**: [ ] GO (Ready for workshop) [ ] NO-GO (Needs fixes)

**Tester Signature**: _____________________
**Date**: _____________________
**Time**: _____________________

---

## 🚨 Quick Troubleshooting

**Problem**: Login fails for demo accounts
**Solution**: Verify accounts created in Supabase Dashboard → Authentication

**Problem**: Routes redirect unexpectedly
**Solution**: Check middleware.ts, verify RLS policies in Supabase

**Problem**: Charts don't load
**Solution**: Check browser console for errors, verify database has data

**Problem**: Offline mode doesn't work
**Solution**: Verify service worker registered (DevTools → Application → Service Workers)

**Problem**: Export fails
**Solution**: Check popup blocker, try different browser

---

**For urgent issues, contact**: support@same.new

**Version 11 | PNG Electoral Commission | October 2025**
