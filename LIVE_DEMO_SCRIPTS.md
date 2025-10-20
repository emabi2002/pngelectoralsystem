# Live Demonstration Scripts
## PNG Digital Electoral System Workshop

**5 Complete Demo Scenarios with Step-by-Step Instructions**
**Total Demo Time**: 45 minutes
**Presenters**: Technical team

---

## 🎯 Demo Overview

| Demo # | Title | Duration | Login As | Key Features |
|--------|-------|----------|----------|--------------|
| **Demo 1** | Enumerator Field Work | 10 min | Enumerator | Household registration, population, Washington Group |
| **Demo 2** | Offline Functionality | 5 min | Enumerator | Offline mode, sync |
| **Demo 3** | Supervisor Monitoring | 10 min | Supervisor | Progress tracking, alerts, household management |
| **Demo 4** | Data Visualization | 10 min | Analyst | Charts, filtering, exports |
| **Demo 5** | Voter Registration | 10 min | Admin/Public | NID lookup, biometrics, electoral roll |

---

## 📱 DEMO 1: Enumerator Field Work (10 minutes)

### **Objective**: Show complete household enumeration workflow

### **Presenter Introduction** (30 seconds)

**Say to Audience**:
> "Let me show you how a field enumerator uses this system. Imagine I'm visiting a household in Port Moresby with my tablet. I'll demonstrate the complete registration process from start to finish."

### **Step 1: Login** (30 seconds)

**Action**:
1. Navigate to: `https://same-6yf918d9bnu-latest.netlify.app/login`
2. Enter:
   - Email: `enumerator@demo.pg`
   - Password: `demo123`
3. Click **Sign In**

**Narrate**:
> "I log in with my enumerator credentials. The system automatically redirects me to my enumerator dashboard."

**Expected**: Redirect to `/enumerator`

---

### **Step 2: View Session Dashboard** (30 seconds)

**Point Out to Audience**:
- "Here's my today's progress: households registered, population counted"
- "You can see my GPS location is being tracked"
- "The interface is designed for tablets - notice the large touch-friendly buttons"

**Action**: Scroll through dashboard to show session stats, GPS, recent activity

---

### **Step 3: Register New Household** (3 minutes)

**Action**: Click **"Register New Household"** button

**Narrate**:
> "Now I'm at a household in Hohola, Port Moresby. Let me register their dwelling information."

**Fill in form** (talking while typing):

**Location Details**:
- Household Number: `DEMO-HH-2025-001` ← **Say**: "Unique identifier for this household"
- Province: `National Capital District`
- District: `Moresby North-East`
- LLG/Ward: `Hohola Ward 2`
- Village/Settlement: `Hohola Community`

**Say**: "The address helps us plan infrastructure like schools and clinics in this area."

**Dwelling Characteristics**:
- Dwelling Type: `Modern` ← **Say**: "This is a permanent modern house"
- Number of Rooms: `5`
- Wall Material: `Concrete blocks`
- Roof Material: `Iron sheets`
- Floor Material: `Concrete`
- Owns Dwelling: ✓ **Yes**

**Say**: "Housing data helps us understand living conditions across PNG."

**Basic Services**:
- Water Source: `Piped water` ← **Say**: "Access to clean water - important for health"
- Toilet Facility: `Flush toilet`
- Electricity Source: `Grid connection`
- Cooking Fuel: `LPG gas`

**Say**: "These indicators align with UN Sustainable Development Goals for infrastructure access."

---

### **Step 4: Capture GPS Coordinates** (1 minute)

**Action**: Click **"Capture GPS"** button

**Narrate**:
> "The tablet uses GPS to record the exact location of this household. This creates an accurate geographic database of our population."

**Wait for GPS lock** (~10-20 seconds)

**Point out**:
- "Latitude and longitude now displayed"
- "This data will appear on our interactive maps"
- "GPS works even in remote areas"

**Coordinates should show**: ~Lat: -9.4 Long: 147.1 (Port Moresby area)

---

### **Step 5: Submit Household** (15 seconds)

**Action**: Click **"Register Household & Add Members"** button

**Narrate**:
> "Household registered! Now I'll add the people who live here."

**Expected**: Success message, proceed to population registration

---

### **Step 6: Register Household Head** (2 minutes)

**Narrate**:
> "First, I register the head of the household. This is Mr. Peter Kaupa."

**Fill in Personal Information**:
- Full Name: `Peter Kaupa`
- Date of Birth: `1978-08-22` ← **Point out**: "System automatically calculates age: 47"
- Gender: `Male`
- Relationship to Head: `Head`
- Marital Status: `Married`
- Place of Birth: `Port Moresby`
- Nationality: `Papua New Guinean`
- Ethnicity: `Motu`
- Religion: `Christian`
- Languages Spoken: Select `English` and `Tok Pisin`

**Education & Employment**:
- Literacy Status: `Literate`
- Highest Education: `University degree`
- Currently in School: ✗ **No**
- Employment Status: `Employed`
- Occupation: `Government Officer`
- Industry Sector: `Public Administration`

**Say**: "Employment and education data helps plan training programs and economic development."

---

### **Step 7: Washington Group Disability Questions** (2 minutes) ⭐ **CRITICAL**

**Narrate** (slow down, emphasize importance):
> "Now comes a VERY important part - the Washington Group disability questions. These are asked in 100+ countries and help us plan services for persons with disabilities. I ask these EXACTLY as written:"

**Ask each question clearly**:

**Question 1 - Seeing**:
> "Do you have difficulty seeing, even if wearing glasses?"
- Response: `No difficulty` ← **Say**: "Mr. Kaupa sees well"

**Question 2 - Hearing**:
> "Do you have difficulty hearing, even if using a hearing aid?"
- Response: `Some difficulty` ← **Say**: "He has minor hearing challenges"

**Question 3 - Walking**:
> "Do you have difficulty walking or climbing steps?"
- Response: `No difficulty`

**Question 4 - Remembering**:
> "Do you have difficulty remembering or concentrating?"
- Response: `No difficulty`

**Question 5 - Self-care**:
> "Do you have difficulty with self-care such as washing all over or dressing?"
- Response: `No difficulty`

**Question 6 - Communicating**:
> "Do you have difficulty communicating, for example understanding or being understood?"
- Response: `No difficulty`

**Point out**:
> "Because he has only 'some difficulty' and no 'a lot of difficulty' or 'cannot do at all', the system marks `has_disability = false`. This follows international standards."

**Say**:
> "This data helps PNG plan hearing aids, accessible infrastructure, special education, and support services."

---

### **Step 8: Health & Migration** (30 seconds)

**Fill quickly**:
- Health Insurance: ✓ **Yes**
- Chronic Illness: (leave blank)
- Migration Status: `Resident`
- Years at Current Residence: `15`

---

### **Step 9: Biometric Capture** (30 seconds)

**Action**: Click **"Capture Photo"**

**Narrate**:
> "I take Mr. Kaupa's photo for identification. The system scores the photo quality."

**Allow camera, take photo of yourself or placeholder**

**Point out**:
- "Quality score appears: 85% - Good quality"
- "This helps deduplicate - ensures one person isn't registered twice"

---

### **Step 10: Submit Member** (15 seconds)

**Action**: Click **"Submit Member"**

**Narrate**:
> "Mr. Kaupa is now registered in PNG's national census database!"

**Expected**: Success message

---

### **Step 11: Add Second Member Quickly** (1 minute)

**Say to Audience**:
> "Let me quickly add his wife to show the workflow."

**Fill form faster** (talking while doing):
- Name: `Mary Kaupa`
- DOB: `1980-05-10` (Age 45)
- Gender: `Female`
- Relationship: `Spouse`
- Marital Status: `Married`
- Education: `Secondary education`
- Employment: `Self-employed`
- All Washington Group questions: `No difficulty`
- Submit

**Say**:
> "In the field, experienced enumerators can register a person in about 3-5 minutes. The tablet makes it much faster than paper forms."

---

### **Demo 1 Wrap-Up** (15 seconds)

**Say to Audience**:
> "And that's the enumerator workflow! From household to individuals, with disability-inclusive questions, all captured digitally. No paper, no transcription errors, real-time GPS tracking. This is the future of census in PNG!"

**Show**: Household now appears in recent activity with member count

---

## 📴 DEMO 2: Offline Functionality (5 minutes)

### **Objective**: Demonstrate system works without internet

### **Introduction** (15 seconds)

**Say to Audience**:
> "One of PNG's biggest challenges is connectivity. Many enumeration areas have no cell service. Let me show you how this system works completely offline."

---

### **Step 1: Go Offline** (30 seconds)

**Action** (visible on screen for audience):
1. Open DevTools (F12)
2. Go to **Network** tab
3. Change throttling dropdown to **"Offline"**

**Narrate**:
> "I'm now simulating no internet connection, like in a remote village."

**Point out**:
> "See the red 'Offline' badge that appears at the top? The system knows it's offline."

---

### **Step 2: Register Household Offline** (2 minutes)

**Action**: Click **"Register New Household"**

**Narrate**:
> "Even with no internet, I can still register households."

**Fill in form** (faster this time):
- Household Number: `OFFLINE-DEMO-001`
- Province: `Gulf`
- District: `Kikori`
- LLG/Ward: `Remote Ward 5`
- Village: `Offline Village` ← **Emphasize**: "No cell towers here!"
- Dwelling Type: `Traditional`
- Rooms: `2`
- Water: `River`
- Toilet: `Pit latrine`
- Electricity: `None`
- Cooking: `Firewood`

**Say**:
> "Notice the infrastructure gaps? This helps us target development programs."

**Try to capture GPS** (will work if browser allows, or skip)

**Submit household**

---

### **Step 3: Show Pending Upload** (30 seconds)

**Point out**:
- "The household is saved to my tablet's local storage"
- "See 'Pending Upload' counter incremented: 1 pending"
- "The data is safe on my device, waiting for internet"

**Say**:
> "I can register 100 households offline, then sync when I return to town."

---

### **Step 4: Add Population Member Offline** (1 minute)

**Action**: Add one member quickly
- Name: `Offline Test Person`
- Basic info filled
- Washington Group: all `No difficulty`
- Submit

**Point out**:
> "Member also saved locally. Pending uploads: 2"

---

### **Step 5: Go Back Online and Sync** (1 minute)

**Action**:
1. In DevTools, change **"Offline"** back to **"Online"**
2. Wait a moment

**Point out**:
> "System detects we're back online automatically. See the 'Online' badge?"

**Action**: Click **"Sync"** button

**Narrate**:
> "Clicking Sync uploads all my pending data to the central database."

**Watch** (should take 2-5 seconds):
- Progress indicator
- "Syncing..." message
- Success: "All data synced!"
- Pending counter goes to 0

---

### **Demo 2 Wrap-Up** (15 seconds)

**Say to Audience**:
> "This is game-changing for PNG. Enumerators can work all day in areas with no connectivity, then sync at night when they return to headquarters or find a signal. No internet? No problem!"

---

## 👨‍💼 DEMO 3: Supervisor Monitoring (10 minutes)

### **Objective**: Show progress tracking and quality control

### **Introduction** (30 seconds)

**Say to Audience**:
> "Now let's see what supervisors use to monitor enumeration progress. I'll login as a district supervisor."

---

### **Step 1: Login as Supervisor** (30 seconds)

**Action**:
1. Logout (or open new incognito window)
2. Navigate to `/login`
3. Login:
   - Email: `supervisor@demo.pg`
   - Password: `demo123`

**Narrate**:
> "System redirects supervisors to the census monitoring dashboard automatically."

**Expected**: Redirect to `/census-monitoring`

---

### **Step 2: Overview Dashboard** (1 minute)

**Point out top cards**:
1. **Overall Progress**:
   - "Total enumeration areas assigned"
   - "Completion percentage - are we on track?"
   - "Total population registered so far"
   - "Average data quality score across all EAs"

2. **Status Distribution Pie Chart**:
   - Green: Completed EAs
   - Yellow: In Progress
   - Red: Not Started
   - "At a glance, I see progress status"

**Say**:
> "This helps me allocate resources - if too many are red (not started), I investigate why."

---

### **Step 3: Enumeration Area Cards** (2 minutes)

**Scroll down to EA cards**

**Point out one EA card**:
- **EA Name**: EA-NCD-001
- **Status Badge**: In Progress (yellow)
- **Progress Bar**: 45% complete
- **Households**: 23 of 50 registered
- **Population**: 87 people
- **Data Quality Score**: 82% (green)
- **Enumerator**: Demo Enumerator
- **Started**: October 10, 2025
- **Last Update**: 2 hours ago

**Say**:
> "I can see everything about each enumeration area. Who's working there, how much is done, data quality."

---

### **Step 4: Alert System** (1 minute)

**Point to alert badges on EA cards**:

**Yellow Alert - Behind Schedule**:
> "This EA is in progress but less than 50% complete. I should check in with the enumerator to see if they need support."

**Orange Alert - Low Data Quality**:
> "This EA has a quality score below 75%. I need to review the data and provide feedback to the enumerator - maybe they need retraining on the Washington Group questions."

**Green Alert - Ready for Verification**:
> "This EA is 100% complete! It's ready for me to verify and approve."

**Say**:
> "The system proactively alerts me to problems. I don't have to wait weeks to discover issues - I can fix them immediately."

---

### **Step 5: Navigate to Household Management** (30 seconds)

**Action**: Click **"Household Management"** in navigation or sidebar

**Narrate**:
> "Now let me verify the quality of the data collected."

**Expected**: Navigate to `/household-management`

---

### **Step 6: Search for Household** (1 minute)

**Action**:
1. In search box, type: `DEMO-HH-2025-001` (from Demo 1)
2. Press Enter or click search

**Narrate**:
> "I can search for any household by number or village name."

**Click on the household** in results

**Point out right panel**:
- Complete household details
- GPS coordinates on map (if map showing)
- Dwelling characteristics
- List of all members

---

### **Step 7: Review Household Members** (1 minute)

**Point to member roster**:
- "Peter Kaupa - Household Head (highlighted)"
- "Mary Kaupa - Spouse"
- "Both show age, gender, relationship"
- "Status badges: In School, Has Disability, Employed"

**Point to Family Composition Summary**:
- "2 total members"
- "2 adults (18-64)"
- "0 children, 0 elderly"
- "0 with disability"
- "2 employed"

**Say**:
> "At a glance, I understand this household's composition."

---

### **Step 8: Edit Member Data (Quality Control)** (1 minute)

**Action**: Click **"Edit"** button on Peter Kaupa

**Narrate**:
> "If I find an error during verification, I can correct it right here."

**Make a small change**:
- Change occupation from "Government Officer" to "Public Servant" (just to demonstrate)
- Click **Save**

**Point out**:
> "Change saved immediately. This is logged in the audit trail - we track who changed what and when."

---

### **Step 9: Export Data** (30 seconds)

**Action**: Click **"Export Household Data"** button

**Narrate**:
> "I can export households to Excel for offline analysis or reporting to headquarters."

**Wait for download** (~2 seconds)

**Say**:
> "Excel file downloads with all household and member data."

---

### **Demo 3 Wrap-Up** (30 seconds)

**Say to Audience**:
> "Supervisors have complete visibility into enumeration progress. Real-time monitoring, automatic alerts, data quality verification, and easy export. No more waiting weeks for paper forms to arrive at headquarters!"

---

## 📊 DEMO 4: Data Visualization & Analysis (10 minutes)

### **Objective**: Show powerful analytics and reporting capabilities

### **Introduction** (30 seconds)

**Say to Audience**:
> "Now let's see how analysts use this data for policy planning. I'll login as a national data analyst."

---

### **Step 1: Login as Analyst** (30 seconds)

**Action**:
1. Logout or new window
2. Login:
   - Email: `analyst@demo.pg`
   - Password: `demo123`

**Narrate**:
> "Analysts are redirected to the Census Dashboard with all the charts and statistics."

**Expected**: Redirect to `/census-dashboard`

---

### **Step 2: Summary Statistics** (1 minute)

**Point to top 4 cards**:

1. **Total Population**: "8.9 million" (example)
   - "Complete population count from census"

2. **Total Households**: "1.8 million"
   - "Average household size: 4.9 persons"

3. **Average Household Size**: "4.9"
   - "Important for housing planning"

4. **Persons with Disability**: "1.2 million (13.5%)"
   - "Based on Washington Group questions"
   - "Aligns with WHO global estimate of 15%"

**Say**:
> "These are the key numbers decision-makers need."

---

### **Step 3: Key Indicators** (1 minute)

**Point to indicator cards**:

1. **Literacy Rate**: "68.2%"
   - "Percentage of people 15+ who can read and write"
   - "SDG Indicator 4.6.1"

2. **School Attendance Rate**: "72.5%"
   - "Percentage of children 5-18 currently in school"
   - "Helps plan school infrastructure"

3. **Employment Rate**: "45.3%"
   - "Percentage of working-age population (15-64) employed"

4. **Disability Prevalence**: "13.5%"
   - "Percentage with 'a lot of difficulty' or 'cannot do at all'"
   - "International standard measurement"

**Say**:
> "Each indicator informs specific policy areas: education, employment, disability services."

---

### **Step 4: Interactive Charts** (3 minutes)

**Chart 1: Population by Age Group (Bar Chart)**

**Point out**:
- "Large bars in 0-14 age groups: young population"
- "Smaller bars in 65+: fewer elderly"
- "This is a classic population pyramid for a developing country"

**Say**:
> "We have a 'youth bulge' - need to plan schools, youth employment programs."

**Hover over a bar**: "See exact numbers on hover: 1.5 million children aged 0-4"

---

**Chart 2: Population by Gender (Pie Chart)**

**Point out**:
- "Nearly 50/50 split: 49.8% Male, 50.2% Female"
- "Sex ratio: 99.2 (slightly more females)"
- "This is a healthy gender balance"

---

**Chart 3: Disability by Functional Domain (Radar Chart)** ⭐ **HIGHLIGHT**

**Narrate slowly** (this is critical):
> "This shows disability prevalence across the 6 Washington Group domains."

**Point to each axis**:
1. **Seeing**: "8.5% have difficulty seeing"
2. **Hearing**: "6.2% have difficulty hearing"
3. **Walking**: "9.1% have mobility difficulties - highest"
4. **Remembering**: "7.3% have cognitive difficulties"
5. **Self-care**: "4.1% have self-care difficulties"
6. **Communicating**: "5.8% have communication difficulties"

**Say**:
> "Walking/mobility is the most common disability in PNG. This tells us to prioritize wheelchair ramps, accessible transport, and physiotherapy services."

---

**Chart 4: Households by Dwelling Type (Bar Chart)**

**Point out**:
- "Traditional: 45% - largest group"
- "Modern: 30%"
- "Semi-permanent: 20%"
- "Temporary: 5%"

**Say**:
> "Nearly half live in traditional housing. This informs housing development programs."

---

**Chart 5: Access to Basic Services (Bar Chart)**

**Point out each bar**:
- "Improved Water: 42% - less than half have clean water!"
- "Improved Sanitation: 38% - major health concern"
- "Electricity: 25% - only 1 in 4 households"
- "Clean Cooking Fuel: 18% - most use firewood"

**Say**:
> "These are critical infrastructure gaps. This data helps PNG prioritize where to build water systems, electrification, and sanitation facilities."

---

### **Step 5: Provincial Filtering** (1 minute)

**Action**: Click **"Filter by Province"** dropdown

**Select**: "Gulf" (or any province)

**Narrate**:
> "I can filter all charts and indicators for a specific province."

**Watch all charts update** (smooth transition)

**Point out**:
- "All 5 charts recalculated for Gulf Province only"
- "Indicators updated: Gulf literacy rate, Gulf employment rate, etc."
- "Now I can compare provinces"

**Action**: Select **"All Provinces"** to reset

**Say**:
> "This helps identify regional disparities and target interventions where most needed."

---

### **Step 6: PDF Export** (1 minute)

**Action**: Click **"Export PDF Report"** button

**Narrate**:
> "I can generate a professional PDF report for stakeholder presentations."

**Wait for generation** (~5 seconds)

**PDF downloads**

**Action**: Open PDF and show briefly

**Point out**:
- "PNG Electoral Commission branding"
- "All charts rendered as high-resolution images"
- "Summary statistics table"
- "Professional multi-page format"

**Say**:
> "This is ready to present to the Prime Minister, Parliament, or development partners."

---

### **Step 7: Excel Export** (1 minute)

**Action**: Click **"Export to Excel"** button

**Excel downloads**

**Action**: Open Excel file

**Show sheets**:
1. "Summary" sheet with key statistics
2. "Age Distribution" sheet
3. "Disability Data" sheet
4. "Housing Statistics" sheet

**Say**:
> "Analysts can do further analysis in Excel, R, or statistical software."

---

### **Demo 4 Wrap-Up** (30 seconds)

**Say to Audience**:
> "From raw census data to professional reports in seconds. Interactive charts, provincial comparisons, disability analytics, and stakeholder-ready exports. This is how PNG can use data for evidence-based policy making!"

---

## 🗳️ DEMO 5: Voter Registration System (10 minutes)

### **Objective**: Show electoral roll registration with NID integration

### **Introduction** (30 seconds)

**Say to Audience**:
> "Finally, let me show you the voter registration system. This integrates with PNG's National ID system to create a clean, deduplicated electoral roll."

---

### **Step 1: Navigate to Voter Registration** (15 seconds)

**Action**:
- If logged in as Analyst, logout or open new window
- Navigate to `/register` (or login as admin first)

**Narrate**:
> "Citizens can register to vote online or at registration centers."

---

### **Step 2: PNG NID Lookup** (1 minute)

**Point to Step 1 of form: NID Lookup**

**Say**:
> "First, we look up the person in PNG's National ID database."

**Action**:
- Enter NID Number: `PNG12345678`
- Click **"Lookup NID"**

**Wait 1-2 seconds** (simulated API call)

**Success**: Citizen information displays

**Point out**:
- "Full Name: John Kila"
- "Date of Birth: 1985-03-15 (Age 40)"
- "Gender: Male"
- "Province: National Capital District"
- "All pulled from authoritative NID database"

**Say**:
> "This prevents duplicate registrations and ensures data accuracy. We don't ask citizens to fill forms - we pull from the official source."

---

### **Step 3: Handle "NID Not Found" Scenario** (2 minutes)

**Say to Audience**:
> "But what if someone doesn't have a National ID yet? Let me show you."

**Action**:
1. Click **"Back"** or restart
2. Enter non-existent NID: `PNG99999999`
3. Click **"Lookup NID"**

**Expected**: "NID Not Found" message appears

**Point out alert**:
> "System says: This citizen is not in the PNG NID database. Would you like to register them?"

**Action**: Click **"Register New Citizen"**

**Form appears**: Comprehensive Citizen Registration Form

**Say**:
> "For citizens without National IDs, we capture their full information to create a temporary electoral identity."

**Fill form quickly** (talking while doing):
- Full Name: `Demo New Citizen`
- Date of Birth: `1990-06-15`
- Gender: `Female`
- Place of Birth: `Lae`
- Nationality: `Papua New Guinean`
- Residential Address: `Section 5, Lae, Morobe`
- Postal Address: `PO Box 456, Lae`
- Phone: `+675 72345999`
- Email: `democitizen@email.com`
- Marital Status: `Single`
- Occupation: `Teacher`
- Education: `University degree`
- Next of Kin: `Jane Doe`
- Next of Kin Contact: `+675 72345998`
- Province: `Morobe`
- District: `Lae`
- LLG/Ward: `Lae Urban Ward 3`

**Action**: Submit citizen registration

**Say**:
> "A temporary NID number is generated: PNG20251010001. This person can now be added to the electoral roll, and their data will be shared with the Civil Registry to issue an official NID."

---

### **Step 4: Biometric Capture** (2 minutes)

**Say**:
> "Step 2 is biometric verification to prevent one person from registering multiple times."

**Action**: Click **"Capture Photo"** (Step 2 of voter registration)

**Allow camera access**

**Take photo** (of yourself or use placeholder)

**Point out**:
- "Facial image captured"
- "Quality score: 87% - Good quality"
- "The system extracts 128 facial feature points"

**Say**:
> "Before adding this person to the electoral roll, the system compares their face against everyone already registered."

**Action**: Click **"Check for Duplicates"**

**Expected**: "No match found - proceed with registration"

**Say**:
> "If we tried to register the same person twice, the system would detect the duplicate face and block it."

---

### **Step 5: Polling Station Assignment** (1 minute)

**Say**:
> "Step 3: Assign the voter to their polling station based on their residential address."

**Point to Step 3 form**:
- Province: National Capital District (already filled from NID)
- District: Moresby North-East
- LLG/Ward: Hohola Ward 2
- **Polling Station**: (dropdown)

**Action**: Select **"Hohola Primary School Polling Station"**

**Say**:
> "Voters are assigned to the closest polling station to their residence. On election day, they'll know exactly where to vote."

---

### **Step 6: Confirm and Submit** (1 minute)

**Point to Step 4: Confirmation**

**Review displays**:
- [ ] Citizen Information (from NID or new registration)
- [ ] Biometric Verification (photo + quality score)
- [ ] Polling Station Assignment

**Say**:
> "Final review before adding to electoral roll. All information correct?"

**Action**: Click **"Confirm Registration"**

**Wait 2-3 seconds** (shows processing)

**Success message**: "Successfully registered on electoral roll!"

**Point out**:
- "Voter ID number generated"
- "Registration date recorded"
- "Person can now vote in elections"

---

### **Step 7: Show Duplicate Prevention** (1 minute) (Optional if time)

**Say**:
> "Let me prove the duplicate prevention works."

**Action**:
1. Go back to registration page
2. Try registering the same person again (same NID or same photo)
3. System should detect duplicate

**Expected**: Error message:
> "This person is already registered on the electoral roll. Registration Date: October 10, 2025."

**Say**:
> "The system prevents duplicate voter registrations - one person, one vote!"

---

### **Demo 5 Wrap-Up** (30 seconds)

**Say to Audience**:
> "This voter registration system ensures a clean electoral roll. Integration with National ID prevents fraud, biometric verification stops duplicates, and polling station assignment makes voting easy. This is the foundation for free and fair elections in PNG!"

---

## 🎬 OVERALL DEMO WRAP-UP (2 minutes)

### **After All 5 Demos Complete**

**Say to Audience**:
> "You've now seen the complete PNG Digital Electoral System in action:
>
> 1. **Enumerators** register households and population in the field, even offline
> 2. **Supervisors** monitor progress in real-time and ensure data quality
> 3. **Analysts** visualize data and generate professional reports
> 4. **Voters** register with biometric verification for a clean electoral roll
> 5. All while ensuring **disability inclusion** with Washington Group questions
>
> This system is:
> - ✅ Built on international standards (UN, WHO, Washington Group)
> - ✅ Designed for PNG's reality (offline-first, mobile-optimized)
> - ✅ Production-ready for nationwide deployment
> - ✅ Comprehensive (census + electoral roll + results)
>
> Any questions?"

---

## 📋 Presenter Checklist

### **Before Each Demo**

- [ ] Close unnecessary browser tabs
- [ ] Clear browser cache (if needed)
- [ ] Have all credentials ready
- [ ] Test internet connection
- [ ] Have backup laptop ready
- [ ] Water nearby (stay hydrated!)

### **During Demos**

- [ ] Speak slowly and clearly
- [ ] Pause for questions
- [ ] Show, don't just tell
- [ ] Engage audience ("Can everyone see this?")
- [ ] Handle errors gracefully (have backup plan)

### **After Each Demo**

- [ ] Ask "Any questions on this part?"
- [ ] Transition smoothly to next demo
- [ ] Reset system if needed

---

## 🚨 Troubleshooting During Live Demo

### **If System is Slow**

- **Say**: "We're experiencing some network latency. This is normal and doesn't affect the offline functionality I showed you earlier."
- Use offline mode if severe

### **If Camera Won't Work**

- **Say**: "Camera permissions vary by browser. In production, tablets have dedicated apps that handle this smoothly."
- Skip biometric capture, explain it verbally

### **If Data Doesn't Save**

- **Say**: "Looks like a temporary database connection issue. The offline mode would have saved this locally."
- Move on to next demo, fix during break

### **If You Make a Mistake**

- **Say**: "Let me correct that - this is why data validation is built in!"
- Show how the system prevents errors
- Turn it into a learning moment

---

**🎯 Practice these demos 2-3 times before the workshop!**

**Total Demo Time**: ~45 minutes (with some buffer for questions)

**🇵🇬 Ready to Showcase PNG's Digital Electoral Transformation!**
