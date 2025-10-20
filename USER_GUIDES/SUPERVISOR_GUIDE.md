# Supervisor User Guide
## PNG Population & Housing Census System

**Version 10.0 | October 2025**

---

## 📊 Your Role as a Supervisor

### Responsibilities
- **Monitor Enumeration Progress**: Track completion across all enumeration areas in your district/province
- **Quality Control**: Review and verify household registrations
- **Support Enumerators**: Resolve issues and provide guidance
- **Data Validation**: Ensure accuracy and completeness of census data
- **Report Progress**: Provide regular updates to management

### Key Performance Indicators
- Enumeration completion rate
- Data quality scores
- Response times to enumerator issues
- Verification turnaround time

---

## 🔐 Logging In

1. Navigate to `/login`
2. Enter your credentials:
   - **Email**: supervisor@demo.pg (for demo)
   - **Password**: demo123 (for demo)
3. System redirects to `/census-monitoring` (your main dashboard)

---

## 📈 Census Progress Monitoring Dashboard

**Route**: `/census-monitoring`

### Dashboard Overview

#### Overall Progress Metrics
- **Total Enumeration Areas**: All EAs assigned to you
- **Completion Percentage**: National or provincial progress
- **Population Registered**: Total individuals counted
- **Average Data Quality**: Quality score across all EAs

#### Status Distribution (Pie Chart)
- **Completed** (Green): 100% households enumerated, ready for verification
- **In Progress** (Yellow): Enumeration ongoing
- **Not Started** (Red): No households registered yet

#### Completion by Area (Bar Chart)
- Visual comparison of progress across EAs
- Identify areas behind schedule
- Plan resource allocation

#### Daily Progress (Line Chart)
- Cumulative household registrations over time
- Cumulative population registrations
- Track if on target to meet deadlines

---

## 🏘️ Enumeration Area Cards

Each EA displays:

### Status Information
- **EA Name**: Enumeration area identifier
- **Status Badge**:
  - 🟢 **Completed**: Ready for verification
  - 🟡 **In Progress**: Active enumeration
  - 🔴 **Not Started**: Pending start

### Progress Metrics
- **Households**: Registered vs Target
- **Population**: Total registered individuals
- **Completion %**: Visual progress bar
- **Data Quality Score**: Percentage (color-coded)
  - Green (≥90%): Excellent
  - Yellow (75-89%): Good
  - Orange (60-74%): Fair
  - Red (<60%): Poor

### Enumerator Information
- Assigned enumerator name
- Contact information

### Timeline
- **Started**: Enumeration start date
- **Last Update**: Most recent activity

---

## 🚨 Alert System

### Automatic Alerts

#### Behind Schedule Alert (Yellow ⚠️)
- **Trigger**: EA in progress but <50% complete
- **Action**: Contact enumerator, investigate delays, reallocate resources if needed

#### Low Data Quality Alert (Orange ⚠️)
- **Trigger**: Data quality score <75%
- **Action**: Review recent registrations, provide feedback to enumerator, schedule retraining

#### Ready for Verification Alert (Green ✓)
- **Trigger**: EA marked as completed
- **Action**: Begin household verification process

### Responding to Alerts
1. Click on EA card to view details
2. Review specific issues
3. Contact enumerator via phone/WhatsApp
4. Document corrective actions
5. Monitor for improvement

---

## 🏠 Household Management

**Route**: `/household-management`

### Purpose
- View all households in your area
- Review household and member details
- Edit or correct registration data
- Manage household members

### Using the Interface

#### Household List (Left Panel)
1. **Search**: Enter household number or village name
2. **Filter by EA**: Select specific enumeration area
3. **Select Household**: Click to view details

#### Household Details (Right Panel)

##### Household Information
- Household number
- Location (Province, District, LLG/Ward, Village)
- GPS coordinates
- Dwelling type and characteristics
- Infrastructure (water, toilet, electricity, cooking fuel)
- Ownership status

##### Member Roster
- Household head (highlighted)
- All members with:
  - Name, Age, Gender
  - Relationship to head
  - Marital status
  - Status badges (In School, Has Disability, Employed)

##### Family Composition Summary
- Total members
- Children (0-17)
- Adults (18-64)
- Elderly (65+)
- Members with disability
- Members in school
- Members employed

#### Actions Available

##### Household-Level
- **Edit Household**: Modify dwelling information
- **Export Data**: Download household details to Excel

##### Member-Level
- **View**: See complete member details
- **Edit**: Correct member information
- **Delete**: Remove incorrect entry (use with caution)
- **Add Member**: Register missed household members

---

## ✅ Data Verification Process

### Step 1: Review Completed EAs
1. Go to Census Monitoring Dashboard
2. Identify EAs with "Completed" status
3. Check data quality score

### Step 2: Sample Verification
1. Open Household Management
2. Select random households from the EA
3. Review for:
   - Complete demographic information
   - Answered Washington Group disability questions
   - Biometric data captured (if applicable)
   - GPS coordinates present
   - Logical consistency (e.g., household head exists, ages make sense)

### Step 3: Quality Checks
- **Completeness**: All required fields filled
- **Accuracy**: Names spelled correctly, dates valid
- **Consistency**: Family relationships logical, ages plausible
- **Disability Data**: All 6 Washington Group questions answered
- **Biometrics**: Photos clear and usable

### Step 4: Approve or Reject
- **Approve**: If quality score >90% and spot checks pass
- **Request Corrections**: If issues found but fixable
- **Reject**: If major data quality problems, requires re-enumeration

### Step 5: Document
- Record verification date
- Note any issues or corrections made
- Update EA status in system

---

## 📞 Supporting Enumerators

### Common Issues and Solutions

#### Issue: Enumerator Behind Schedule
**Actions**:
- Call to understand reason (terrain difficulty, household refusals, equipment issues)
- Provide guidance on time management
- Consider reassigning portions of EA if necessary
- Offer field support visit

#### Issue: Low Data Quality Score
**Actions**:
- Review specific errors via Household Management
- Provide targeted feedback
- Schedule refresher training
- Shadow enumerator in field if persistent issues

#### Issue: GPS Not Capturing
**Actions**:
- Verify device location services enabled
- Suggest moving to open area
- If persistent, allow manual coordinate entry
- Consider device replacement if hardware fault

#### Issue: Household Refusals
**Actions**:
- Provide communication tips
- Explain legal mandate for census participation
- Offer to accompany enumerator
- Escalate to district administrator if needed

#### Issue: Washington Group Questions Confusion
**Actions**:
- Review correct question wording
- Explain response categories
- Clarify when to assess children vs adults
- Practice scenarios

---

## 📱 Communication Channels

### With Enumerators
- **Primary**: Phone calls
- **Daily Reports**: WhatsApp group
- **Urgent Issues**: Direct call/SMS
- **Data Issues**: System notes in Household Management

### With Management
- **Weekly Reports**: Progress summary
- **Issues Escalation**: Email to management
- **Emergency**: Direct phone contact

### WhatsApp Group Guidelines
- Daily progress updates by enumerators
- Photos of enumeration in action (no PII)
- Questions and quick answers
- Motivational support
- Schedule updates

---

## 📊 Reporting Requirements

### Daily Report (End of Day)
- EAs active today
- Households registered today
- Population registered today
- Issues encountered
- Planned activities for tomorrow

### Weekly Report (Every Friday)
- Overall completion percentage
- EA-by-EA status
- Data quality summary
- Enumerator performance
- Challenges and solutions
- Resources needed

### Incident Reports (As Needed)
- Equipment failures
- Security incidents
- Natural obstacles (floods, landslides)
- Community resistance
- Any data breaches

---

## 🎯 Best Practices

### Daily Routine
1. ✅ Check Census Monitoring Dashboard first thing
2. ✅ Review overnight registrations
3. ✅ Respond to alerts (behind schedule, low quality)
4. ✅ Contact each enumerator at least once
5. ✅ Verify sample households
6. ✅ Update progress report
7. ✅ Plan next day activities

### Quality Assurance
- Verify at least 10% of households in each EA
- Check different enumerators (avoid patterns)
- Look for systematic errors
- Address issues immediately, not at end

### Enumerator Support
- Be available during field hours
- Respond quickly to queries
- Provide positive feedback for good work
- Address problems constructively
- Regular check-ins, not just when issues arise

### Data Security
- Never share individual household data
- Keep devices secure
- Report any suspected data breaches
- Use encrypted communication for sensitive topics

---

## 🚨 Troubleshooting

### Problem: Can't see any enumeration areas
**Solution**:
1. Verify your province/district assignment
2. Contact administrator to check EA assignments
3. Refresh page/clear cache

### Problem: Data quality scores seem wrong
**Solution**:
1. Review calculation methodology (see technical docs)
2. Check if missing data fields are weighted heavily
3. Verify with sample household reviews
4. Report systematic issues to administrator

### Problem: Enumerator can't sync data
**Solution**:
1. Check enumerator's internet connection
2. Verify no pending system maintenance
3. Try manual sync button
4. If persistent, collect data offline and sync later

### Problem: Duplicate households appearing
**Solution**:
1. Investigate with enumerator (accidental re-registration)
2. Review household numbers (should be unique)
3. Merge or delete duplicate via Household Management
4. Retrain on household number assignment

---

## 📞 Getting Help

### Technical Support
**Email**: census-support@pngelectoralsystem.pg
**Phone**: [Help Desk Number]
**Hours**: 7:00 AM - 7:00 PM

### Field Support
**District Coordinator**: [Name and Contact]
**Provincial Manager**: [Name and Contact]

### Emergency
**After-Hours Hotline**: [Emergency Contact]

---

## 📋 Quick Reference Checklist

### Weekly Verification Checklist
- [ ] All EAs checked for progress
- [ ] Behind-schedule areas identified and action taken
- [ ] Quality issues addressed with enumerators
- [ ] Sample households verified (10% minimum)
- [ ] Enumerator performance reviewed
- [ ] Weekly report submitted
- [ ] Equipment needs identified
- [ ] Next week's plan drafted

### Data Quality Checklist
- [ ] All household members listed
- [ ] Household head clearly identified
- [ ] Ages and birthdates consistent
- [ ] All 6 Washington Group questions answered
- [ ] GPS coordinates captured
- [ ] Dwelling characteristics complete
- [ ] Basic services data recorded
- [ ] Biometric photos captured (if applicable)

---

## 🎓 Training Resources

- **Video Tutorials**: Available on system home page
- **Enumerator Guide**: Share with your team
- **Washington Group Guide**: Disability question reference
- **Census Methodology**: UN standards documentation

---

**🇵🇬 Thank you for ensuring quality census data for Papua New Guinea!**

Your diligent supervision ensures accurate data that will guide national development for years to come.

---

**Questions? Contact the Census Support Team**

**Version 10.0 | PNG Electoral Commission | October 2025**
