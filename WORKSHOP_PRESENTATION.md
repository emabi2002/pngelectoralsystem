# PNG Electoral Commission Workshop Presentation
## Digital Electoral Transformation System

**October 13-15, 2025 | Hilton Hotel, Port Moresby**

---

## 📋 Presentation Structure

**Duration**: 3 hours (with breaks)
**Format**: Interactive demonstration with hands-on sessions

---

## Slide 1: Title Slide

### **PNG Electoral Commission**
### **Digital Electoral Transformation System**

**Comprehensive Population Census & Electoral Management Platform**

October 13-15, 2025
Hilton Hotel, Port Moresby

**Presented by**: [Presenter Name]
**Technical Lead**: Same AI Development Team

---

## Slide 2: Workshop Objectives

### **What We'll Cover Today**

1. ✅ System Overview & Capabilities
2. ✅ Live System Demonstration
3. ✅ Hands-On Interactive Session
4. ✅ Technical Architecture Review
5. ✅ Deployment & Rollout Planning
6. ✅ Training & Support Framework
7. ✅ Q&A and Discussion

### **Learning Outcomes**

By the end of this workshop, you will be able to:
- Navigate and use all system modules
- Understand the census and electoral registration workflows
- Operate the enumerator mobile interface
- Generate reports and export data
- Manage users and monitor progress

---

## Slide 3: System Overview

### **Complete Digital Electoral Solution**

**Three Integrated Systems in One Platform**:

1. **🗳️ Voter Registration & Electoral Roll**
   - Biometric voter registration
   - PNG NID integration
   - Duplicate detection with facial recognition
   - Real-time electoral roll updates

2. **👥 Population & Housing Census**
   - Nationwide population enumeration
   - Disability-inclusive data collection (Washington Group standards)
   - Household and dwelling characteristics
   - All-ages registration (newborns to elderly)

3. **📊 Election Results Management**
   - Real-time results transmission from polling stations
   - Interactive map visualization
   - Statistical analysis and reporting
   - Audit trail and transparency

---

## Slide 4: Key Features

### **What Makes This System Special?**

| Feature | Capability | Benefit |
|---------|-----------|---------|
| **Biometric Identity** | Face recognition, fingerprints | Prevents duplicate registrations |
| **Offline First** | Works without internet | Enables remote area enumeration |
| **Real-Time Sync** | Automatic data upload when online | Central data consolidation |
| **GPS Tracking** | Location capture for every household | Geographic accuracy |
| **Disability Inclusive** | Washington Group questions | International standard compliance |
| **Multilingual** | English + Tok Pisin | Accessible to all citizens |
| **Role-Based Access** | 4 user roles with permissions | Secure, appropriate access |
| **Professional Reporting** | PDF + Excel exports | Stakeholder-ready outputs |

---

## Slide 5: International Standards Compliance

### **Built on Global Best Practices**

**United Nations**: Principles and Recommendations for Population and Housing Censuses (Revision 3)

**WHO**: International Classification of Functioning, Disability and Health (ICF)

**Washington Group**: Short Set on Disability Questions (WG-SS)

**PNG NSO**: National Statistics Office guidelines and requirements

**Sustainable Development Goals**: Aligned with SDG indicators
- SDG 3: Health and well-being
- SDG 4: Quality education
- SDG 6: Clean water and sanitation
- SDG 10: Reduced inequalities

---

## Slide 6: Technical Architecture

### **Modern, Scalable Technology Stack**

**Frontend**:
- Next.js 15 (React framework)
- TypeScript (type-safe code)
- Tailwind CSS + shadcn UI (modern design)
- Progressive Web App (offline support)

**Backend**:
- Supabase (PostgreSQL database)
- Real-time subscriptions
- Row-Level Security (RLS)
- Automated backups

**Biometrics**:
- Face-API.js (facial recognition)
- Fingerprint capture support
- Quality scoring algorithms

**Maps & Visualization**:
- Leaflet (PNG province maps)
- Recharts (interactive charts)
- Real-time data updates

**Deployment**:
- Netlify (static hosting)
- CDN distribution (fast global access)
- HTTPS encryption (secure)

---

## PART 1: LIVE DEMONSTRATION (45 minutes)

---

## Slide 7: Demo Introduction

### **We'll Demonstrate All Key Workflows**

**Scenario**: Complete census enumeration from field to analysis

**Characters**:
- **Demo Enumerator**: Field worker collecting household data
- **Demo Supervisor**: Monitoring and verifying enumeration progress
- **Demo Analyst**: Analyzing data and generating reports
- **Demo Administrator**: Managing the system and users

**Follow Along**: Login credentials provided in your handout

---

## Slide 8: Demo 1 - Enumerator Field Work

### **Workflow: Household Enumeration**

**URL**: `/enumerator`

**Steps to Demonstrate**:
1. Login as enumerator (`enumerator@demo.pg` / `demo123`)
2. View session dashboard (today's progress)
3. Capture GPS location
4. Register new household:
   - Household information
   - GPS coordinates
   - Dwelling characteristics
   - Basic services (water, sanitation, electricity)
5. Add household members:
   - Household head
   - Spouse
   - Children (different ages)
   - Complete all demographics
   - **Washington Group disability questions** (IMPORTANT!)
   - Biometric photo capture
6. Review household composition summary
7. Submit and view in recent activity

**Highlight**:
- Tablet-optimized interface (large buttons)
- Offline capability (will demo)
- Real-time GPS capture
- Disability-inclusive questions

---

## Slide 9: Demo 2 - Offline Functionality

### **Critical Feature: Works Without Internet**

**Demonstration**:
1. Disconnect from internet (show offline badge)
2. Register a new household completely offline
3. Add household members
4. Show "Pending Uploads" counter
5. Reconnect to internet
6. Click "Sync" button
7. Watch data upload automatically
8. Verify data now in central database

**Why This Matters**:
- Many enumeration areas have no cellular coverage
- Enumerators can work all day, sync at night
- No data loss, automatic backup

**Technical Note**: Uses IndexedDB for local storage, service workers for offline support

---

## Slide 10: Demo 3 - Supervisor Monitoring

### **Workflow: Progress Tracking & Quality Control**

**URL**: `/census-monitoring`

**Login**: supervisor@demo.pg / demo123

**Steps to Demonstrate**:
1. View overall progress dashboard
   - Total EAs, completion percentage
   - Population registered
   - Average data quality score
2. Review status distribution (pie chart)
   - Completed, In Progress, Not Started
3. Check enumeration area cards
   - Individual EA progress
   - Data quality scores
   - **Automatic alerts** (behind schedule, low quality, ready for verification)
4. Identify problematic EA
5. Navigate to Household Management
6. Search for specific household
7. Review household and member details
8. Edit member information (demonstrate quality control)
9. Export household data to Excel

**Highlight**:
- Real-time monitoring
- Proactive alerts
- Easy data correction
- Export capabilities

---

## Slide 11: Demo 4 - Data Visualization & Analysis

### **Workflow: Census Data Analysis**

**URL**: `/census-dashboard`

**Login**: analyst@demo.pg / demo123

**Steps to Demonstrate**:
1. View summary statistics
   - Total population
   - Total households
   - Average household size
   - Persons with disability
2. Review key indicators
   - Literacy rate
   - School attendance rate
   - Employment rate
   - Disability prevalence
3. Explore interactive charts:
   - **Population by Age Group** (bar chart)
   - **Gender Distribution** (pie chart)
   - **Disability by Functional Domain** (radar chart) - HIGHLIGHT
   - **Households by Dwelling Type** (bar chart)
   - **Access to Basic Services** (bar chart)
4. Apply provincial filter
   - Select specific province
   - Watch all charts update
   - Indicators recalculate
5. Export PDF report
   - Professional formatting
   - PNG Electoral Commission branding
   - All charts and tables included
6. Export to Excel
   - Multi-sheet workbook
   - Summary, age distribution, disability data, housing stats

**Highlight**:
- Powerful data visualization
- Provincial comparisons
- Professional reporting
- Ready for stakeholder presentations

---

## Slide 12: Demo 5 - Voter Registration System

### **Workflow: Electoral Roll Registration**

**URL**: `/register`

**Steps to Demonstrate**:
1. **PNG NID Lookup**:
   - Enter NID number: PNG12345678
   - Click "Lookup NID"
   - Show citizen information auto-populated
   - Display from authoritative PNG NID source
2. **NID Not Found Scenario**:
   - Enter non-existent NID
   - Show "Not Found" message
   - Option to register new citizen
   - Fill comprehensive citizen registration form
   - Submit and generate new NID number
3. **Biometric Capture**:
   - Capture facial photo
   - Show quality score
   - Demonstrate duplicate detection
   - Try registering same person twice
   - System prevents duplicate with face matching
4. **Electoral Roll Registration**:
   - Select polling station
   - Confirm registration
   - Add to electoral roll
   - Success notification

**Highlight**:
- Integration with PNG NID system
- Handles citizens not yet in NID
- Biometric deduplication
- Electoral roll separate from census

---

## PART 2: HANDS-ON SESSION (30 minutes)

---

## Slide 13: Hands-On Activity

### **Your Turn to Try!**

**Activity 1: Enumerator Role** (10 minutes)
- [ ] Login as enumerator
- [ ] Register a household in your enumeration area
- [ ] Add at least 3 household members
- [ ] Answer Washington Group disability questions
- [ ] Capture GPS coordinates
- [ ] Submit successfully

**Activity 2: Supervisor Role** (10 minutes)
- [ ] Login as supervisor
- [ ] Find your enumeration area
- [ ] Check data quality score
- [ ] Navigate to household management
- [ ] View a household you registered
- [ ] Export data to Excel

**Activity 3: Analyst Role** (10 minutes)
- [ ] Login as analyst
- [ ] Explore the census dashboard
- [ ] Filter by a specific province
- [ ] Export PDF report
- [ ] Open and review the PDF

**Support**: Facilitators will circulate to assist

---

## Slide 14: Discussion - Real-World Scenarios

### **How Would You Handle These Situations?**

**Scenario 1**: Enumerator in remote area with no connectivity for 3 days
- **Solution**: Offline functionality, sync when back to coverage

**Scenario 2**: Person refuses to answer disability questions
- **Solution**: Mark as "No difficulty" if they can demonstrate function, or "Prefer not to answer" option

**Scenario 3**: Household members temporarily away (migrant workers)
- **Solution**: Register usual residents, note migration status

**Scenario 4**: Person with disability cannot take photo (sensitivity)
- **Solution**: Biometrics optional, can skip if consent not given

**Scenario 5**: Supervisor notices many errors from one enumerator
- **Solution**: Low quality alert triggers, supervisor contacts for retraining

**Discussion**: What other scenarios should we consider?

---

## PART 3: TECHNICAL DEEP DIVE (30 minutes)

---

## Slide 15: Database Architecture

### **PostgreSQL Database Schema**

**Main Tables**:

**households**
- id (UUID, primary key)
- household_number (unique identifier)
- enumeration_area (EA assignment)
- province, district, llg_ward, village_settlement
- dwelling_type, construction materials
- water_source, toilet_facility, electricity, cooking_fuel
- GPS coordinates (latitude, longitude)
- enumerator_id, enumeration_date
- verification_status, data_quality_score

**population**
- id (UUID, primary key)
- household_id (foreign key → households)
- census_id (unique census number)
- nid_number (link to PNG NID)
- full_name, date_of_birth, age, gender
- relationship_to_head, marital_status
- education, employment, migration data
- **Washington Group disability questions** (6 fields)
- has_disability (auto-calculated flag)
- Biometric data (photo, fingerprints, iris)
- enumeration_area, enumerator_id

**citizens** (PNG NID replica)
- Full personal information
- NID number (unique)
- Issue and expiry dates
- Status (active, suspended, expired, revoked)

**voters** (Electoral roll)
- NID reference
- Polling station assignment
- Biometric deduplication data

**user_profiles** (Authentication)
- User accounts with roles
- Province/EA assignments
- Activity tracking

---

## Slide 16: Security & Privacy

### **Data Protection Measures**

**Row-Level Security (RLS)**:
- Enumerators see only their EA data
- Supervisors see only their province data
- Analysts see all data (read-only)
- Administrators have full access

**Encryption**:
- HTTPS for all data transmission
- Database encryption at rest
- Biometric data separately encrypted

**Access Control**:
- Role-based permissions
- Audit trail (all changes logged)
- Session management
- Password policies

**Privacy Compliance**:
- No PII in public datasets
- Statistical aggregates only for publication
- Individual records confidential
- Consent for biometric capture

**Backup & Recovery**:
- Daily automated backups (7-day retention)
- Point-in-time recovery (restore to exact second)
- Off-site backup to AWS S3
- Disaster recovery plan documented

---

## Slide 17: Disability Data - Washington Group Standards

### **Why Washington Group Questions?**

**Global Standard**: Used in 100+ countries

**Functional Approach**: Measures difficulty in doing, not medical diagnosis

**6 Core Domains**:
1. **Seeing**: Even with glasses
2. **Hearing**: Even with hearing aid
3. **Walking**: Or climbing steps
4. **Remembering**: Or concentrating
5. **Self-care**: Washing or dressing
6. **Communicating**: Understanding or being understood

**4 Response Categories**:
- No difficulty
- Some difficulty
- A lot of difficulty ← **Disability threshold**
- Cannot do at all ← **Disability threshold**

**Disability Identification**: Person has difficulty in ANY domain = has disability

**Why This Matters**:
- Identifies 10-20% of population (vs 2-3% with medical approach)
- Enables targeted support services
- Aligns with UN Convention on Rights of Persons with Disabilities
- Comparable across countries for SDG monitoring

---

## Slide 18: Data Flow Diagram

### **From Field to Decision-Makers**

```
┌─────────────────────────────────────────────────────────┐
│  FIELD ENUMERATION (Enumerator)                         │
│  - Register household + members                         │
│  - Capture GPS, biometrics                              │
│  - Washington Group disability questions                │
│  - Offline storage (IndexedDB)                          │
└───────────────────┬─────────────────────────────────────┘
                    │ Auto-sync when online
                    ↓
┌─────────────────────────────────────────────────────────┐
│  CENTRAL DATABASE (Supabase PostgreSQL)                 │
│  - Real-time replication                                │
│  - Row-level security                                   │
│  - Automated backups                                    │
└───────────────────┬─────────────────────────────────────┘
                    │ Real-time subscriptions
                    ↓
┌─────────────────────────────────────────────────────────┐
│  SUPERVISOR MONITORING                                  │
│  - Progress tracking                                    │
│  - Quality control                                      │
│  - Data verification                                    │
└───────────────────┬─────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────────────────┐
│  DATA ANALYSIS & REPORTING (Analyst)                    │
│  - Interactive dashboards                               │
│  - Statistical indicators                               │
│  - PDF/Excel exports                                    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────┐
│  DECISION-MAKERS & STAKEHOLDERS                         │
│  - Policy planning                                      │
│  - Resource allocation                                  │
│  - Development programs                                 │
│  - Electoral planning                                   │
└─────────────────────────────────────────────────────────┘
```

---

## PART 4: DEPLOYMENT & ROLLOUT (20 minutes)

---

## Slide 19: Deployment Plan

### **Phased Rollout Strategy**

**Phase 1: Pilot (Weeks 1-2)**
- Select 2-3 enumeration areas
- Train pilot enumerators and supervisor
- Test all workflows with real data
- Identify and fix issues
- Refine procedures based on feedback

**Phase 2: Provincial Rollout (Weeks 3-6)**
- Deploy to 1-2 provinces
- Train all province enumerators and supervisors
- Monitor closely
- Provide intensive support
- Validate data quality

**Phase 3: National Expansion (Weeks 7-12)**
- Roll out to remaining provinces
- Continuous training program
- Ongoing monitoring and support
- Regular quality audits
- Progress reporting to management

**Phase 4: Completion & Analysis (Weeks 13-16)**
- Finalize all enumeration
- Data cleaning and validation
- Comprehensive analysis
- Final reports and publications
- Electoral roll generation

---

## Slide 20: Training Program

### **Comprehensive Training for All Users**

**Enumerator Training** (3 days)
- Day 1: System navigation and household registration
- Day 2: Population registration and disability questions
- Day 3: Offline functionality and troubleshooting
- **Materials**: Enumerator Guide (PDF), video tutorials, practice scenarios
- **Certification**: Practical test before field deployment

**Supervisor Training** (2 days)
- Day 1: Monitoring dashboard and household management
- Day 2: Quality control and data verification
- **Materials**: Supervisor Guide, quality checklists
- **Support**: WhatsApp group for ongoing assistance

**Analyst Training** (1 day)
- Census dashboard navigation
- Report generation and export
- Statistical indicator interpretation
- **Materials**: Analyst Guide, example reports

**Administrator Training** (1 day)
- User management
- System configuration
- Backup and recovery
- **Materials**: Administrator Guide, technical documentation

**Ongoing Support**:
- Help desk (email and phone)
- Video tutorial library
- Troubleshooting documentation
- Regular refresher sessions

---

## Slide 21: Infrastructure Requirements

### **What You Need to Deploy**

**Hardware**:
- **Enumerators**: Android tablets (minimum specifications)
  - Android 10 or higher
  - 4 GB RAM
  - 32 GB storage
  - GPS enabled
  - Front-facing camera (5 MP minimum)
  - Battery life: 8+ hours
  - Recommended: Samsung Galaxy Tab A8 or equivalent

- **Supervisors**: Laptop or desktop computer
  - Modern web browser (Chrome, Firefox, Edge)
  - Stable internet connection

- **Analysts/Administrators**: Desktop computer
  - Large screen for data visualization
  - Reliable internet

**Connectivity**:
- Internet access at supervisor/analyst offices
- Enumerators can work offline, sync when coverage available
- Consider portable Wi-Fi hotspots for team syncing in field

**Software**:
- No installation required (web-based)
- Works in modern browsers
- Progressive Web App (can install to home screen)

**Database**:
- Hosted on Supabase (already provisioned)
- Scalable to millions of records
- Automatic backups

---

## Slide 22: Support Structure

### **Multi-Tier Support System**

**Tier 1: Help Desk**
- Email: census-support@pngelectoralsystem.pg
- Phone: [Help desk number]
- Hours: 7:00 AM - 7:00 PM daily during enumeration
- Response time: <1 hour during business hours
- **Handles**: Basic questions, password resets, account issues

**Tier 2: Field Supervisors**
- Direct support to enumerators
- WhatsApp groups by province
- On-site troubleshooting
- Equipment issues
- **Handles**: Enumeration problems, data quality, field logistics

**Tier 3: Technical Support Team**
- Database issues
- System errors
- Performance problems
- Integration issues
- **Handles**: Technical failures, bugs, system configuration

**Tier 4: Development Team**
- Code bugs
- Feature enhancements
- Architecture changes
- **Contact**: support@same.new

**Escalation Process**: Tier 1 → Tier 2 → Tier 3 → Tier 4 within 24 hours

---

## PART 5: IMPACT & BENEFITS (15 minutes)

---

## Slide 23: Benefits for PNG

### **Why This System Matters**

**For Citizens**:
- ✅ Accurate representation in census
- ✅ Access to services based on real needs
- ✅ Disability-inclusive policies
- ✅ Improved electoral participation

**For Government**:
- ✅ Evidence-based policy making
- ✅ Accurate population data for planning
- ✅ Resource allocation based on actual needs
- ✅ Monitor progress on national development goals
- ✅ Transparent electoral process

**For Development Partners**:
- ✅ Reliable data for program targeting
- ✅ SDG indicator monitoring
- ✅ Impact evaluation baseline
- ✅ Regional comparisons

**For Electoral Commission**:
- ✅ Clean, deduplicated electoral roll
- ✅ Accurate polling station assignments
- ✅ Real-time election results
- ✅ Transparent, auditable processes

---

## Slide 24: Use Cases & Applications

### **What Can You Do With This Data?**

**Education Planning**:
- Count of school-age children (5-18) by province
- Plan school construction and teacher deployment
- Identify out-of-school children
- Special education needs (children with disabilities)

**Healthcare Services**:
- Population by age group for health service planning
- Disability prevalence for rehabilitation services
- Maternal health (women of reproductive age)
- Elderly care needs (population 65+)

**Infrastructure Development**:
- Housing needs (dwelling types, overcrowding)
- Water and sanitation gaps
- Electricity access rates
- Target areas for infrastructure investment

**Social Protection**:
- Identify vulnerable populations
- Persons with disabilities needing support
- Elderly without family support
- Child protection (orphans, vulnerable children)

**Electoral Administration**:
- Accurate voter population projections
- Polling station placement
- Registration drive targeting
- Results analysis

**Economic Planning**:
- Labor force size and composition
- Employment and unemployment rates
- Occupation and industry patterns
- Migration trends

---

## Slide 25: Success Metrics

### **How We'll Measure Success**

**Coverage**:
- ✅ Target: 100% of enumeration areas covered
- ✅ Target: >95% of households registered
- ✅ Target: All household members enumerated

**Data Quality**:
- ✅ Target: <2% missing data in critical fields
- ✅ Target: >90% average data quality score
- ✅ Target: All disability questions answered

**Efficiency**:
- ✅ Target: <30 minutes per household
- ✅ Target: 10-15 households per enumerator per day
- ✅ Target: <5% error rate requiring correction

**System Performance**:
- ✅ Target: 99.9% uptime during enumeration period
- ✅ Target: <3 second page load times
- ✅ Target: 100% data sync success rate

**User Satisfaction**:
- ✅ Target: >80% enumerator satisfaction score
- ✅ Target: >90% supervisor satisfaction
- ✅ Target: <5% support ticket rate

**Timeline**:
- ✅ Training completed on schedule
- ✅ Enumeration completed within 12 weeks
- ✅ Preliminary results within 2 weeks of completion
- ✅ Final census report within 3 months

---

## PART 6: NEXT STEPS & Q&A (10 minutes)

---

## Slide 26: Immediate Next Steps

### **Action Items from This Workshop**

**This Week**:
- [ ] Review user guides (Enumerator, Supervisor, Analyst, Admin)
- [ ] Set up demo user accounts for key staff
- [ ] Test system with sample data
- [ ] Provide feedback on any issues or enhancement requests

**Next 2 Weeks**:
- [ ] Finalize enumeration area assignments
- [ ] Procure tablets for enumerators
- [ ] Schedule enumerator training sessions
- [ ] Set up supervisor office workstations
- [ ] Create province-specific deployment plans

**Next Month**:
- [ ] Conduct pilot in selected EAs
- [ ] Train all enumerators and supervisors
- [ ] Begin Phase 1 deployment
- [ ] Establish help desk operations
- [ ] Set up monitoring and reporting protocols

---

## Slide 27: Key Contacts

### **Who to Contact for What**

**System Access & Training**:
- [Training Coordinator Name]
- Email: training@pngelectoralsystem.pg
- Phone: [Phone number]

**Technical Support**:
- [Technical Lead Name]
- Email: census-support@pngelectoralsystem.pg
- Phone: [Help desk number]

**Data & Analysis**:
- [Chief Statistician Name]
- Email: census-data@pngelectoralsystem.pg
- Phone: [Phone number]

**Project Management**:
- [Project Manager Name]
- Email: project@pngelectoralsystem.pg
- Phone: [Phone number]

**Development Team**:
- Same AI Development Team
- Email: support@same.new

---

## Slide 28: Questions & Discussion

### **Open Floor for Questions**

**Common Questions We Can Address**:
- How does the system handle no internet in remote areas?
- What happens if a tablet breaks during enumeration?
- How do we ensure data privacy and security?
- Can we customize the system for PNG-specific needs?
- What training is available?
- How much does this cost to operate?
- How do we handle households that refuse to participate?
- Can we integrate with other government systems?
- What are the hardware requirements?
- How long does enumeration take per household?

**Let's discuss your specific concerns and scenarios!**

---

## Slide 29: Workshop Feedback

### **Help Us Improve**

**Please Complete the Feedback Form**:
- Clarity of presentation
- Usefulness of demonstration
- Hands-on session effectiveness
- Documentation quality
- Overall satisfaction

**What We Want to Know**:
- What worked well?
- What needs improvement?
- What additional training do you need?
- What features are missing?
- What concerns do you have about deployment?

**Your feedback shapes the final system!**

---

## Slide 30: Thank You!

### **PNG Electoral Commission**
### **Digital Electoral Transformation System**

**You are building the future of PNG's data infrastructure!**

This system will:
- ✅ Provide accurate population data for national planning
- ✅ Ensure clean, deduplicated electoral rolls
- ✅ Enable disability-inclusive policies
- ✅ Support evidence-based decision making
- ✅ Modernize PNG's electoral and census processes

**Together, we are making PNG's first fully digital census a success!**

---

**Contact**: support@pngelectoralsystem.pg

**Resources**:
- System URL: https://same-6yf918d9bnu-latest.netlify.app
- Documentation: [Link]
- Video Tutorials: [Link]
- User Guides: [Link]

**Workshop Materials**: All presentations, guides, and resources available for download

---

## 🇵🇬 Appendix: Additional Slides (If Time Permits)

---

## Appendix A: Washington Group Questions - Deep Dive

### **The 6 Questions - Exact Wording**

These must be asked EXACTLY as written:

**1. Seeing**:
"Do you have difficulty seeing, even if wearing glasses?"

**2. Hearing**:
"Do you have difficulty hearing, even if using a hearing aid?"

**3. Walking**:
"Do you have difficulty walking or climbing steps?"

**4. Remembering**:
"Do you have difficulty remembering or concentrating?"

**5. Self-care**:
"Do you have difficulty with self-care such as washing all over or dressing?"

**6. Communicating**:
"Do you have difficulty communicating, for example understanding or being understood?"

**Response Options** (show card to respondent):
1. No - no difficulty
2. Yes - some difficulty
3. Yes - a lot of difficulty
4. Cannot do at all

**For Children Under 5**: Use Washington Group/UNICEF Child Functioning Module (extended questions)

---

## Appendix B: Sample Reports

**[Include screenshots of actual PDF and Excel exports]**

- Census Summary Report (PDF)
- Provincial Population Analysis (Excel)
- Disability Statistics Report (PDF)
- Household Listing (Excel)

---

## Appendix C: Comparison with Other Systems

### **Why This System is Superior**

| Feature | Traditional Paper Census | Other Digital Systems | This System |
|---------|-------------------------|----------------------|-------------|
| **Offline Capability** | N/A | Limited | Full offline support |
| **Biometric Deduplication** | No | Sometimes | Yes (face + fingerprint) |
| **Real-Time Monitoring** | No | Sometimes | Yes (live dashboards) |
| **Disability Inclusive** | Rarely | Rarely | Yes (Washington Group) |
| **GPS Tracking** | No | Sometimes | Yes (automatic) |
| **Multilingual** | Manual translation | Rarely | Yes (English + Tok Pisin) |
| **Export Capabilities** | Manual | Basic | Professional PDF + Excel |
| **Role-Based Access** | N/A | Basic | Advanced (4 roles, RLS) |
| **Cost** | High (printing, manual entry) | Moderate-High | Moderate |
| **Data Quality** | Low (transcription errors) | Medium | High (validation rules) |
| **Timeline** | 6-12 months | 3-6 months | 2-4 months |

---

**End of Presentation**

**Total Slides**: 30 + 3 appendix slides

**Estimated Duration**: 3 hours including breaks and hands-on session

**Prepared for**: PNG Electoral Commission Workshop
**Date**: October 13-15, 2025
**Location**: Hilton Hotel, Port Moresby

---

## 📦 Workshop Materials Package

Participants will receive:
1. This presentation (PDF)
2. All 4 user guides (PDF)
3. Quick reference cards (laminated)
4. Demo account credentials
5. System access URL
6. Support contact information
7. Video tutorial links
8. Feedback form

---

**🇵🇬 Building Papua New Guinea's Digital Future Together!**
