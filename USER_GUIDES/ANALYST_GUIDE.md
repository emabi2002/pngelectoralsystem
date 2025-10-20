# Analyst User Guide
## PNG Population & Housing Census System

**Version 10.0 | October 2025**

---

## 📊 Your Role as a Data Analyst

### Responsibilities
- **Data Analysis**: Analyze census data to extract meaningful insights
- **Visualization**: Create charts, graphs, and maps to communicate findings
- **Report Generation**: Produce professional reports for stakeholders
- **Statistical Validation**: Ensure data integrity and statistical soundness
- **Indicator Calculation**: Compute key demographic and socio-economic indicators

### Key Deliverables
- Population statistics and demographics
- Disability prevalence analysis
- Socio-economic indicators
- Geographic distribution reports
- Policy recommendation briefs

---

## 🔐 Logging In

1. Navigate to `/login`
2. Enter your credentials:
   - **Email**: analyst@demo.pg (for demo)
   - **Password**: demo123 (for demo)
3. System redirects to `/census-dashboard` (your main workspace)

---

## 📈 Census Data Visualization Dashboard

**Route**: `/census-dashboard`

### Dashboard Components

#### Summary Statistics (Top Cards)
- **Total Population**: Sum of all registered individuals
- **Total Households**: Number of households enumerated
- **Average Household Size**: Population ÷ Households
- **Persons with Disability**: Count and percentage of population

#### Key Indicators (Middle Section)
- **Literacy Rate**: % of population 15+ who can read and write
- **School Attendance Rate**: % of age 5-18 currently in school
- **Employment Rate**: % of age 15-64 who are employed
- **Disability Prevalence**: % with "A lot of difficulty" or "Cannot do at all"

---

## 📊 Interactive Charts

### 1. Population by Age Group (Bar Chart)
**Purpose**: Visualize age distribution for demographic analysis

**Age Groups**:
- 0-4 years
- 5-14 years
- 15-24 years
- 25-54 years
- 55-64 years
- 65+ years

**Use Cases**:
- Identify youth bulge or aging population
- Plan education infrastructure (5-18 group)
- Assess working-age population (15-64)
- Plan elderly services (65+)

**How to Read**:
- X-axis: Age groups
- Y-axis: Number of persons
- Hover over bars for exact counts
- Compare across provinces using filter

---

### 2. Population by Gender (Pie Chart)
**Purpose**: Show gender distribution and sex ratio

**Indicators Derived**:
- **Sex Ratio** = (Males ÷ Females) × 100
- Gender balance in population

**Use Cases**:
- Assess gender equity
- Identify gender-specific needs
- Compare to national averages

**How to Read**:
- Pie slices show proportion
- Percentages displayed on hover
- Colors: Blue (Male), Pink (Female), Gray (Other)

---

### 3. Disability by Functional Domain (Radar Chart)
**Purpose**: Visualize disability prevalence across Washington Group domains

**Domains Measured**:
1. Seeing
2. Hearing
3. Walking/Mobility
4. Remembering/Concentrating
5. Self-care
6. Communicating

**Severity Levels**:
- No difficulty
- Some difficulty
- A lot of difficulty
- Cannot do at all

**Disability Identified**: "A lot of difficulty" OR "Cannot do at all"

**How to Read**:
- Each axis represents a functional domain
- Distance from center = prevalence rate (%)
- Larger polygon = higher disability prevalence
- Compare across provinces to identify regional patterns

**Use Cases**:
- Identify most common disability types
- Plan targeted support services
- Assess accessibility needs
- Monitor disability inclusion programs

---

### 4. Households by Dwelling Type (Horizontal Bar Chart)
**Purpose**: Understand housing characteristics and conditions

**Dwelling Types**:
- Traditional
- Modern
- Semi-permanent
- Temporary
- Other

**Use Cases**:
- Assess housing quality
- Plan infrastructure upgrades
- Target housing assistance programs
- Identify vulnerable populations (temporary housing)

---

### 5. Access to Basic Services (Bar Chart)
**Purpose**: Measure access to essential infrastructure

**Services Tracked**:
- **Improved Water Source**: % with piped water or protected well
- **Improved Sanitation**: % with flush toilet or pit latrine
- **Electricity**: % with connection to grid or generator
- **Cooking Fuel**: % using clean fuels (LPG, electricity)

**SDG Alignment**:
- SDG 6: Clean Water and Sanitation
- SDG 7: Affordable and Clean Energy

**How to Read**:
- Green bars = good access
- Yellow bars = moderate access
- Red bars = poor access (need intervention)

---

## 🗺️ Provincial Filtering

### How to Use
1. Click "Filter by Province" dropdown at top
2. Select province from list
3. All charts update automatically
4. Summary statistics recalculate
5. Click "All Provinces" to reset

### Applications
- Provincial comparisons
- Regional development planning
- Identify disparities between provinces
- Targeted policy interventions

---

## 📥 Export Capabilities

### PDF Export
**Button**: "Export PDF Report"

**Contents**:
- Executive summary with key statistics
- All charts as high-resolution images
- Age distribution table
- Disability statistics table
- Education and employment indicators
- Housing and infrastructure data
- Provincial breakdowns

**Format**: Professional multi-page PDF with PNG Electoral Commission branding

**Use Cases**:
- Stakeholder presentations
- Government reports
- Workshop handouts
- Archive documentation

---

### Excel Export
**Button**: "Export to Excel"

**Workbook Structure**:
- **Summary Sheet**: Key statistics and indicators
- **Age Distribution**: Population by age group and gender
- **Disability Data**: Prevalence by domain and severity
- **Housing Statistics**: Dwelling types and infrastructure

**Use Cases**:
- Further analysis in Excel or R
- Custom chart creation
- Statistical modeling
- Data sharing with partners

---

## 📊 Statistical Analysis Guide

### Demographic Indicators

#### 1. Dependency Ratio
**Formula**: ((Population 0-14 + Population 65+) ÷ Population 15-64) × 100

**Interpretation**:
- <50: Low dependency, large working-age population
- 50-75: Moderate dependency
- >75: High dependency, strain on working-age population

#### 2. Age-Sex Pyramid Analysis
**Method**: Create stacked bar chart (males left, females right) by age group

**Patterns to Identify**:
- **Pyramid**: Young, growing population
- **Bell**: Mature, stable population
- **Inverted Pyramid**: Aging population
- **Irregular**: Migration, conflict, or data quality issues

#### 3. Sex Ratio
**Formula**: (Male Population ÷ Female Population) × 100

**Normal Range**: 95-105

**Deviations**:
- <95: Female majority (migration, conflict mortality)
- >105: Male majority (labor migration, data issues)

---

### Disability Indicators

#### 1. Overall Disability Prevalence
**Formula**: (Persons with disability ÷ Total population) × 100

**Global Average**: 15% (WHO estimate)

**PNG Context**: Compare to national baseline and regional data

#### 2. Prevalence by Domain
**Formula**: (Persons with "A lot of difficulty" or "Cannot do at all" in domain ÷ Total population) × 100

**Most Common Globally**:
1. Mobility (walking)
2. Vision (seeing)
3. Cognition (remembering)

#### 3. Multiple Disabilities
**Definition**: Persons with difficulties in 2+ domains

**Formula**: Count persons flagged in multiple Washington Group questions

**Significance**: Indicates need for comprehensive support

---

### Socio-Economic Indicators

#### 1. Literacy Rate (Age 15+)
**Formula**: (Literate population 15+ ÷ Total population 15+) × 100

**SDG Indicator**: 4.6.1

**Use**: Assess education system effectiveness, plan adult education

#### 2. School Attendance Rate (Age 5-18)
**Formula**: (Currently in school 5-18 ÷ Total population 5-18) × 100

**Target**: >95% (universal education)

**Use**: Identify out-of-school children, plan school infrastructure

#### 3. Employment Rate (Age 15-64)
**Formula**: (Employed 15-64 ÷ Total population 15-64) × 100

**Compare**:
- By gender (identify gender gaps)
- By province (economic development disparities)

#### 4. Unemployment Rate
**Formula**: (Unemployed in labor force ÷ Total labor force) × 100

**Labor Force**: Employed + Actively seeking work

---

### Housing Indicators

#### 1. Access to Improved Water
**Definition**: Piped water, protected well, protected spring

**Formula**: (Households with improved water ÷ Total households) × 100

**SDG Target**: 6.1 - Universal access

#### 2. Access to Improved Sanitation
**Definition**: Flush toilet, ventilated pit latrine

**Formula**: (Households with improved sanitation ÷ Total households) × 100

**SDG Target**: 6.2 - Adequate sanitation for all

#### 3. Homeownership Rate
**Formula**: (Households owning dwelling ÷ Total households) × 100

**Use**: Housing security assessment

---

## 📈 Data Quality Assessment

### Completeness Checks
- **Missing Data Rate**: % of fields left blank
- **Target**: <2% for critical fields
- **Action**: If >5%, coordinate with supervisors for data correction

### Consistency Checks
- **Age-Education Consistency**: No university degrees for children
- **Age-Marital Status**: No married children under legal age
- **Household Size**: Average 3-8 members (flag outliers)

### Plausibility Checks
- **Sex Ratio**: Should be 95-105 (flag if outside)
- **Literacy Rate**: Should increase with younger ages (education expansion)
- **Disability Rate**: Compare to WHO global estimate (15%)

### Geographic Validation
- **GPS Coordinates**: All within PNG boundaries
- **Province-District Match**: Districts belong to correct provinces
- **Enumeration Area Coverage**: No gaps or overlaps

---

## 🎨 Visualization Best Practices

### Choosing Chart Types
- **Trends Over Time**: Line chart
- **Comparisons**: Bar chart
- **Proportions**: Pie chart (max 5-6 categories)
- **Distributions**: Histogram
- **Relationships**: Scatter plot
- **Multidimensional**: Radar chart

### Color Guidelines
- **Categorical Data**: Distinct colors (blue, green, orange, purple)
- **Sequential Data**: Shades of one color (light to dark)
- **Diverging Data**: Two-color gradient (red-white-blue)
- **Accessibility**: Use patterns too, not just colors

### Labeling
- Clear axis titles with units
- Legends for multiple series
- Data labels on hover (interactive)
- Source attribution at bottom

---

## 📝 Report Writing Tips

### Executive Summary (1 page)
- Key findings (3-5 bullet points)
- Total population and households
- Major demographic trends
- Disability prevalence highlight
- 1-2 policy recommendations

### Methodology (1-2 pages)
- Census reference date
- Enumeration period
- Geographic coverage
- Data collection methods
- Quality assurance procedures
- Limitations and caveats

### Findings (5-10 pages)
- Section per theme (demographics, disability, socio-economic, housing)
- Charts and tables embedded
- Interpretation of each indicator
- Provincial comparisons where relevant

### Recommendations (1-2 pages)
- Evidence-based policy suggestions
- Priority areas for intervention
- Resource allocation guidance
- Areas for further research

---

## 🔍 Advanced Analysis

### Disaggregation Strategies
- By gender (identify gender gaps)
- By age group (target life-cycle interventions)
- By province (regional development planning)
- By disability status (inclusion policies)
- By rural/urban (infrastructure priorities)

### Cross-Tabulation Examples
- **Education × Disability**: Do persons with disabilities have lower education?
- **Employment × Gender**: Assess gender employment gap
- **Water Access × Province**: Identify provinces needing infrastructure
- **Dwelling Type × Household Size**: Overcrowding analysis

### Correlation Analysis
- **Education Level vs Employment**: Assess education-employment link
- **Household Size vs Poverty Indicators**: Larger households more vulnerable?
- **Disability vs School Attendance**: Inclusive education assessment

---

## 📞 Data Requests

### Internal Requests
- Provide specific datasets to researchers
- Ensure data anonymization (no PII)
- Require data use agreement
- Track data usage

### External Requests (Public)
- Only aggregated statistics
- No individual records
- Require ethics approval for research
- Coordinate with legal/privacy officer

---

## 🚨 Troubleshooting

### Problem: Charts not loading
**Solution**:
1. Refresh page
2. Check internet connection
3. Clear browser cache
4. Try different browser

### Problem: Export fails
**Solution**:
1. Check popup blocker (allow downloads)
2. Ensure sufficient disk space
3. Try smaller date range/filters
4. Contact support if persistent

### Problem: Numbers don't match expected totals
**Solution**:
1. Check provincial filters applied
2. Verify data sync completed
3. Review recent data corrections
4. Recalculate manually to cross-check

---

## 📞 Getting Help

**Technical Support**: census-support@pngelectoralsystem.pg
**Data Questions**: census-data@pngelectoralsystem.pg
**Statistical Guidance**: [Chief Statistician Contact]

---

## 📋 Quick Reference

### Daily Tasks
- [ ] Check dashboard for new data
- [ ] Run data quality checks
- [ ] Update analysis spreadsheets
- [ ] Respond to data requests
- [ ] Brief management on key findings

### Weekly Tasks
- [ ] Generate provincial comparison reports
- [ ] Update indicator tracking
- [ ] Meet with policy teams
- [ ] Prepare visualizations for stakeholders

### Monthly Tasks
- [ ] Comprehensive analysis report
- [ ] Board presentation preparation
- [ ] External data sharing (approved requests)
- [ ] Archive datasets

---

**🇵🇬 Your analysis transforms census data into insights that shape Papua New Guinea's future!**

---

**Version 10.0 | PNG Electoral Commission | October 2025**
