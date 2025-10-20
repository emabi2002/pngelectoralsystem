'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { CensusStatistics, PopulationData, HouseholdData } from './censusInterfaces'

class ExportService {
  // Export Census Statistics to PDF
  exportStatisticsToPDF(stats: CensusStatistics, province?: string) {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text('PNG Population Census Report', 14, 22)

    doc.setFontSize(12)
    doc.text(province ? `Province: ${province}` : 'National Summary', 14, 30)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36)

    // Summary Statistics
    doc.setFontSize(14)
    doc.text('Summary Statistics', 14, 46)

    autoTable(doc, {
      startY: 50,
      head: [['Indicator', 'Value']],
      body: [
        ['Total Population', stats.totalPopulation.toLocaleString()],
        ['Total Households', stats.totalHouseholds.toLocaleString()],
        ['Average Household Size', stats.averageHouseholdSize.toFixed(2)],
        ['Male Population', stats.malePopulation.toLocaleString()],
        ['Female Population', stats.femalePopulation.toLocaleString()],
        ['Sex Ratio (M/F)', (stats.malePopulation / stats.femalePopulation * 100).toFixed(1)],
        ['Persons with Disability', stats.populationWithDisability.toLocaleString()],
        ['Disability Prevalence', `${((stats.populationWithDisability / stats.totalPopulation) * 100).toFixed(2)}%`],
      ]
    })

    // Age Distribution
    doc.addPage()
    doc.setFontSize(14)
    doc.text('Population by Age Group', 14, 22)

    const ageData = Object.entries(stats.populationByAgeGroup).map(([age, count]) => [
      age,
      count.toLocaleString(),
      `${((count / stats.totalPopulation) * 100).toFixed(1)}%`
    ])

    autoTable(doc, {
      startY: 28,
      head: [['Age Group', 'Population', 'Percentage']],
      body: ageData
    })

    // Disability Statistics
    const startY1 = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text('Disability by Functional Domain', 14, startY1)

    const disabilityData = Object.entries(stats.disabilityByType).map(([type, count]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      count.toLocaleString(),
      `${((count / stats.totalPopulation) * 100).toFixed(2)}%`
    ])

    autoTable(doc, {
      startY: startY1 + 6,
      head: [['Functional Domain', 'Affected Population', 'Percentage']],
      body: disabilityData
    })

    // Education Indicators
    doc.addPage()
    doc.setFontSize(14)
    doc.text('Education Indicators', 14, 22)

    autoTable(doc, {
      startY: 28,
      head: [['Indicator', 'Value']],
      body: [
        ['Literacy Rate', `${stats.literacyRate.toFixed(1)}%`],
        ['School Attendance Rate (5-18 years)', `${stats.schoolAttendanceRate.toFixed(1)}%`],
        ['Employment Rate (15-64 years)', `${stats.employmentRate.toFixed(1)}%`]
      ]
    })

    // Housing Statistics
    const startY2 = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text('Housing Statistics', 14, startY2)

    const dwellingData = Object.entries(stats.householdsByDwellingType).map(([type, count]) => [
      type,
      count.toLocaleString(),
      `${((count / stats.totalHouseholds) * 100).toFixed(1)}%`
    ])

    autoTable(doc, {
      startY: startY2 + 6,
      head: [['Dwelling Type', 'Households', 'Percentage']],
      body: dwellingData
    })

    // Basic Services Access
    const startY3 = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text('Access to Basic Services', 14, startY3)

    autoTable(doc, {
      startY: startY3 + 6,
      head: [['Service', 'Households with Access', 'Coverage (%)']],
      body: [
        ['Electricity', stats.accessToBasicServices.electricity.toLocaleString(),
          `${((stats.accessToBasicServices.electricity / stats.totalHouseholds) * 100).toFixed(1)}%`],
        ['Clean Water', stats.accessToBasicServices.cleanWater.toLocaleString(),
          `${((stats.accessToBasicServices.cleanWater / stats.totalHouseholds) * 100).toFixed(1)}%`],
        ['Toilet Facility', stats.accessToBasicServices.toilet.toLocaleString(),
          `${((stats.accessToBasicServices.toilet / stats.totalHouseholds) * 100).toFixed(1)}%`]
      ]
    })

    // Footer
    doc.setFontSize(8)
    doc.text('PNG Electoral Commission - Digital Census System', 14, 285)
    doc.text('Workshop: October 13-15, 2025 • Hilton Hotel, Port Moresby', 14, 290)

    // Save PDF
    const filename = province
      ? `census_report_${province.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      : `census_report_national_${new Date().toISOString().split('T')[0]}.pdf`

    doc.save(filename)
  }

  // Export Census Statistics to Excel
  exportStatisticsToExcel(stats: CensusStatistics, province?: string) {
    const workbook = XLSX.utils.book_new()

    // Summary Sheet
    const summaryData = [
      ['PNG POPULATION CENSUS REPORT'],
      ['Generated:', new Date().toLocaleDateString()],
      province ? ['Province:', province] : ['Scope:', 'National'],
      [],
      ['SUMMARY STATISTICS'],
      ['Indicator', 'Value'],
      ['Total Population', stats.totalPopulation],
      ['Total Households', stats.totalHouseholds],
      ['Average Household Size', parseFloat(stats.averageHouseholdSize.toFixed(2))],
      ['Male Population', stats.malePopulation],
      ['Female Population', stats.femalePopulation],
      ['Sex Ratio (M/F per 100)', parseFloat((stats.malePopulation / stats.femalePopulation * 100).toFixed(1))],
      ['Persons with Disability', stats.populationWithDisability],
      ['Disability Prevalence (%)', parseFloat(((stats.populationWithDisability / stats.totalPopulation) * 100).toFixed(2))],
      [],
      ['EDUCATION & EMPLOYMENT'],
      ['Literacy Rate (%)', parseFloat(stats.literacyRate.toFixed(1))],
      ['School Attendance Rate (%)', parseFloat(stats.schoolAttendanceRate.toFixed(1))],
      ['Employment Rate (%)', parseFloat(stats.employmentRate.toFixed(1))]
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Age Distribution Sheet
    const ageData = [
      ['POPULATION BY AGE GROUP'],
      [],
      ['Age Group', 'Population', 'Percentage'],
      ...Object.entries(stats.populationByAgeGroup).map(([age, count]) => [
        age,
        count,
        parseFloat(((count / stats.totalPopulation) * 100).toFixed(1))
      ])
    ]

    const ageSheet = XLSX.utils.aoa_to_sheet(ageData)
    XLSX.utils.book_append_sheet(workbook, ageSheet, 'Age Distribution')

    // Disability Sheet
    const disabilityData = [
      ['DISABILITY STATISTICS'],
      ['Washington Group Short Set Results'],
      [],
      ['Functional Domain', 'Affected Population', 'Percentage of Total'],
      ...Object.entries(stats.disabilityByType).map(([type, count]) => [
        type.charAt(0).toUpperCase() + type.slice(1),
        count,
        parseFloat(((count / stats.totalPopulation) * 100).toFixed(2))
      ]),
      [],
      ['Total Persons with Disability', stats.populationWithDisability],
      ['Disability Prevalence Rate (%)', parseFloat(((stats.populationWithDisability / stats.totalPopulation) * 100).toFixed(2))]
    ]

    const disabilitySheet = XLSX.utils.aoa_to_sheet(disabilityData)
    XLSX.utils.book_append_sheet(workbook, disabilitySheet, 'Disability')

    // Housing Sheet
    const housingData = [
      ['HOUSING STATISTICS'],
      [],
      ['Dwelling Type', 'Number of Households', 'Percentage'],
      ...Object.entries(stats.householdsByDwellingType).map(([type, count]) => [
        type,
        count,
        parseFloat(((count / stats.totalHouseholds) * 100).toFixed(1))
      ]),
      [],
      ['BASIC SERVICES ACCESS'],
      ['Service', 'Households with Access', 'Coverage (%)'],
      ['Electricity', stats.accessToBasicServices.electricity,
        parseFloat(((stats.accessToBasicServices.electricity / stats.totalHouseholds) * 100).toFixed(1))],
      ['Clean Water', stats.accessToBasicServices.cleanWater,
        parseFloat(((stats.accessToBasicServices.cleanWater / stats.totalHouseholds) * 100).toFixed(1))],
      ['Toilet Facility', stats.accessToBasicServices.toilet,
        parseFloat(((stats.accessToBasicServices.toilet / stats.totalHouseholds) * 100).toFixed(1))]
    ]

    const housingSheet = XLSX.utils.aoa_to_sheet(housingData)
    XLSX.utils.book_append_sheet(workbook, housingSheet, 'Housing')

    // Save Excel
    const filename = province
      ? `census_data_${province.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
      : `census_data_national_${new Date().toISOString().split('T')[0]}.xlsx`

    XLSX.writeFile(workbook, filename)
  }

  // Export Population Data to Excel
  exportPopulationDataToExcel(populationData: PopulationData[]) {
    const workbook = XLSX.utils.book_new()

    // Prepare data for export
    const exportData = populationData.map(person => ({
      'Census ID': person.census_id,
      'Household ID': person.household_id,
      'NID Number': person.nid_number || '',
      'Full Name': person.full_name,
      'Date of Birth': person.date_of_birth,
      'Age': person.age,
      'Gender': person.gender,
      'Relationship to Head': person.relationship_to_head,
      'Marital Status': person.marital_status,
      'Place of Birth': person.place_of_birth,
      'Nationality': person.nationality,
      'Ethnicity': person.ethnicity || '',
      'Religion': person.religion || '',
      'Languages': person.languages_spoken.join(', '),
      'Literacy Status': person.literacy_status,
      'Highest Education': person.highest_education,
      'Currently in School': person.current_school_attendance ? 'Yes' : 'No',
      'Employment Status': person.employment_status,
      'Occupation': person.occupation || '',
      'Difficulty Seeing': person.difficulty_seeing,
      'Difficulty Hearing': person.difficulty_hearing,
      'Difficulty Walking': person.difficulty_walking,
      'Difficulty Remembering': person.difficulty_remembering,
      'Difficulty Self-care': person.difficulty_selfcare,
      'Difficulty Communicating': person.difficulty_communicating,
      'Has Disability': person.has_disability ? 'Yes' : 'No',
      'Enumeration Area': person.enumeration_area,
      'Enumeration Date': person.enumeration_date
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Population Data')

    const filename = `population_census_data_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, filename)
  }

  // Export Household Data to Excel
  exportHouseholdDataToExcel(householdData: HouseholdData[]) {
    const workbook = XLSX.utils.book_new()

    const exportData = householdData.map(household => ({
      'Household Number': household.household_number,
      'Province': household.province,
      'District': household.district,
      'LLG/Ward': household.llg_ward,
      'Village/Settlement': household.village_settlement,
      'Enumeration Area': household.enumeration_area,
      'Dwelling Type': household.dwelling_type,
      'Wall Material': household.wall_material,
      'Roof Material': household.roof_material,
      'Floor Material': household.floor_material,
      'Number of Rooms': household.number_of_rooms,
      'Water Source': household.water_source,
      'Toilet Facility': household.toilet_facility,
      'Electricity Source': household.electricity_source,
      'Cooking Fuel': household.cooking_fuel,
      'Owns Dwelling': household.owns_dwelling ? 'Yes' : 'No',
      'Total Members': household.total_members,
      'Latitude': household.latitude || '',
      'Longitude': household.longitude || '',
      'Enumeration Date': household.enumeration_date,
      'Verification Status': household.verification_status
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Household Data')

    const filename = `household_census_data_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, filename)
  }

  // Generate Custom Report (flexible template)
  generateCustomReport(
    title: string,
    sections: Array<{
      title: string
      data: Array<[string, string | number]>
    }>
  ) {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text(title, 14, 22)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

    let currentY = 40

    sections.forEach((section, index) => {
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }

      doc.setFontSize(14)
      doc.text(section.title, 14, currentY)
      currentY += 6

      autoTable(doc, {
        startY: currentY,
        head: [['Field', 'Value']],
        body: section.data
      })

      currentY = (doc as any).lastAutoTable.finalY + 10
    })

    // Footer
    doc.setFontSize(8)
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(`PNG Electoral Commission - Page ${i} of ${pageCount}`, 14, 285)
    }

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`)
  }
}

export const exportService = new ExportService()
export default exportService
