'use client'

import { supabase } from './supabase'
import type {
  HouseholdData,
  PopulationData,
  CensusStatistics,
  EnumerationArea
} from './censusInterfaces'

class CensusService {
  // Household Registration
  async registerHousehold(householdData: Omit<HouseholdData, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean
    data?: HouseholdData
    error?: string
  }> {
    try {
      const { data, error } = await supabase
        .from('households')
        .insert([{
          ...householdData,
          verification_status: householdData.verification_status || 'pending',
          data_quality_score: householdData.data_quality_score || 100
        }])
        .select()
        .single()

      if (error) {
        console.error('Household registration error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as HouseholdData }
    } catch (error) {
      console.error('Household registration error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async getHouseholdById(householdId: string): Promise<HouseholdData | null> {
    try {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .eq('id', householdId)
        .single()

      if (error) {
        console.error('Error fetching household:', error)
        return null
      }

      return data as HouseholdData
    } catch (error) {
      console.error('Get household error:', error)
      return null
    }
  }

  async getHouseholdsByEnumerationArea(enumerationArea: string): Promise<HouseholdData[]> {
    try {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .eq('enumeration_area', enumerationArea)
        .order('household_number')

      if (error) {
        console.error('Error fetching households:', error)
        return []
      }

      return data as HouseholdData[]
    } catch (error) {
      console.error('Get households error:', error)
      return []
    }
  }

  // Population Registration (All Ages)
  async registerPerson(personData: Omit<PopulationData, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean
    data?: PopulationData
    error?: string
  }> {
    try {
      // Check for duplicates if NID or birth certificate exists
      if (personData.nid_number) {
        const duplicate = await this.findPersonByNID(personData.nid_number)
        if (duplicate) {
          return {
            success: false,
            error: 'Person already registered with this NID number'
          }
        }
      }

      // Calculate disability status
      const hasDisability = this.calculateDisabilityStatus(personData)

      const { data, error } = await supabase
        .from('population')
        .insert([{
          ...personData,
          has_disability: hasDisability,
          is_verified: personData.is_verified ?? false
        }])
        .select()
        .single()

      if (error) {
        console.error('Person registration error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as PopulationData }
    } catch (error) {
      console.error('Person registration error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async findPersonByNID(nidNumber: string): Promise<PopulationData | null> {
    try {
      const { data, error } = await supabase
        .from('population')
        .select('*')
        .eq('nid_number', nidNumber)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error finding person by NID:', error)
        return null
      }

      return data as PopulationData
    } catch (error) {
      console.error('Find person by NID error:', error)
      return null
    }
  }

  async getHouseholdMembers(householdId: string): Promise<PopulationData[]> {
    try {
      const { data, error } = await supabase
        .from('population')
        .select('*')
        .eq('household_id', householdId)
        .order('age', { ascending: false })

      if (error) {
        console.error('Error fetching household members:', error)
        return []
      }

      return data as PopulationData[]
    } catch (error) {
      console.error('Get household members error:', error)
      return []
    }
  }

  // Census Statistics and Analytics
  async getCensusStatistics(province?: string, district?: string): Promise<CensusStatistics> {
    try {
      let query = supabase.from('population').select('*')

      if (province) {
        query = query.eq('enumeration_area', province)
      }
      if (district) {
        query = query.eq('enumeration_area', district)
      }

      const { data: populationData, error } = await query

      if (error) {
        console.error('Error fetching census statistics:', error)
        return this.getDefaultStatistics()
      }

      const { data: householdsData } = await supabase
        .from('households')
        .select('*')

      return this.calculateStatistics(populationData as PopulationData[], householdsData as HouseholdData[] || [])
    } catch (error) {
      console.error('Get census statistics error:', error)
      return this.getDefaultStatistics()
    }
  }

  private calculateStatistics(population: PopulationData[], households: HouseholdData[]): CensusStatistics {
    const totalPopulation = population.length
    const totalHouseholds = households.length
    const malePopulation = population.filter(p => p.gender === 'Male').length
    const femalePopulation = population.filter(p => p.gender === 'Female').length

    // Age groups
    const ageGroups = {
      '0-4': population.filter(p => p.age <= 4).length,
      '5-14': population.filter(p => p.age >= 5 && p.age <= 14).length,
      '15-24': population.filter(p => p.age >= 15 && p.age <= 24).length,
      '25-54': population.filter(p => p.age >= 25 && p.age <= 54).length,
      '55-64': population.filter(p => p.age >= 55 && p.age <= 64).length,
      '65+': population.filter(p => p.age >= 65).length
    }

    // Disability statistics
    const populationWithDisability = population.filter(p => p.has_disability).length
    const disabilityByType = {
      seeing: population.filter(p =>
        p.difficulty_seeing === 'A lot of difficulty' || p.difficulty_seeing === 'Cannot do at all'
      ).length,
      hearing: population.filter(p =>
        p.difficulty_hearing === 'A lot of difficulty' || p.difficulty_hearing === 'Cannot do at all'
      ).length,
      walking: population.filter(p =>
        p.difficulty_walking === 'A lot of difficulty' || p.difficulty_walking === 'Cannot do at all'
      ).length,
      remembering: population.filter(p =>
        p.difficulty_remembering === 'A lot of difficulty' || p.difficulty_remembering === 'Cannot do at all'
      ).length,
      selfcare: population.filter(p =>
        p.difficulty_selfcare === 'A lot of difficulty' || p.difficulty_selfcare === 'Cannot do at all'
      ).length,
      communicating: population.filter(p =>
        p.difficulty_communicating === 'A lot of difficulty' || p.difficulty_communicating === 'Cannot do at all'
      ).length
    }

    // Education and employment
    const literate = population.filter(p => p.literacy_status === 'Literate').length
    const literacyRate = totalPopulation > 0 ? (literate / totalPopulation) * 100 : 0

    const schoolAge = population.filter(p => p.age >= 5 && p.age <= 18).length
    const attending = population.filter(p => p.current_school_attendance && p.age >= 5 && p.age <= 18).length
    const schoolAttendanceRate = schoolAge > 0 ? (attending / schoolAge) * 100 : 0

    const workingAge = population.filter(p => p.age >= 15 && p.age <= 64).length
    const employed = population.filter(p =>
      p.employment_status.includes('Employed') || p.employment_status === 'Self-employed'
    ).length
    const employmentRate = workingAge > 0 ? (employed / workingAge) * 100 : 0

    // Household statistics
    const averageHouseholdSize = totalHouseholds > 0 ? totalPopulation / totalHouseholds : 0

    const householdsByDwellingType = {
      Traditional: households.filter(h => h.dwelling_type === 'Traditional').length,
      Modern: households.filter(h => h.dwelling_type === 'Modern').length,
      'Semi-permanent': households.filter(h => h.dwelling_type === 'Semi-permanent').length,
      Temporary: households.filter(h => h.dwelling_type === 'Temporary').length,
      Other: households.filter(h => h.dwelling_type === 'Other').length
    }

    const accessToBasicServices = {
      electricity: households.filter(h =>
        h.electricity_source && h.electricity_source !== 'None' && h.electricity_source !== 'No electricity'
      ).length,
      cleanWater: households.filter(h =>
        h.water_source && (h.water_source.includes('Piped') || h.water_source.includes('Protected'))
      ).length,
      toilet: households.filter(h =>
        h.toilet_facility && h.toilet_facility !== 'Bush/Open defecation'
      ).length
    }

    return {
      totalPopulation,
      totalHouseholds,
      malePopulation,
      femalePopulation,
      averageHouseholdSize,
      populationByAgeGroup: ageGroups,
      populationWithDisability,
      disabilityByType,
      literacyRate,
      schoolAttendanceRate,
      employmentRate,
      householdsByDwellingType,
      accessToBasicServices
    }
  }

  private calculateDisabilityStatus(person: Omit<PopulationData, 'id' | 'created_at' | 'updated_at'>): boolean {
    // Following Washington Group approach: "A lot of difficulty" or "Cannot do at all" in any domain
    return (
      person.difficulty_seeing === 'A lot of difficulty' ||
      person.difficulty_seeing === 'Cannot do at all' ||
      person.difficulty_hearing === 'A lot of difficulty' ||
      person.difficulty_hearing === 'Cannot do at all' ||
      person.difficulty_walking === 'A lot of difficulty' ||
      person.difficulty_walking === 'Cannot do at all' ||
      person.difficulty_remembering === 'A lot of difficulty' ||
      person.difficulty_remembering === 'Cannot do at all' ||
      person.difficulty_selfcare === 'A lot of difficulty' ||
      person.difficulty_selfcare === 'Cannot do at all' ||
      person.difficulty_communicating === 'A lot of difficulty' ||
      person.difficulty_communicating === 'Cannot do at all'
    )
  }

  private getDefaultStatistics(): CensusStatistics {
    return {
      totalPopulation: 0,
      totalHouseholds: 0,
      malePopulation: 0,
      femalePopulation: 0,
      averageHouseholdSize: 0,
      populationByAgeGroup: {
        '0-4': 0,
        '5-14': 0,
        '15-24': 0,
        '25-54': 0,
        '55-64': 0,
        '65+': 0
      },
      populationWithDisability: 0,
      disabilityByType: {
        seeing: 0,
        hearing: 0,
        walking: 0,
        remembering: 0,
        selfcare: 0,
        communicating: 0
      },
      literacyRate: 0,
      schoolAttendanceRate: 0,
      employmentRate: 0,
      householdsByDwellingType: {
        Traditional: 0,
        Modern: 0,
        'Semi-permanent': 0,
        Temporary: 0,
        Other: 0
      },
      accessToBasicServices: {
        electricity: 0,
        cleanWater: 0,
        toilet: 0
      }
    }
  }

  // Enumeration Area Management
  async createEnumerationArea(areaData: Omit<EnumerationArea, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean
    data?: EnumerationArea
    error?: string
  }> {
    try {
      const { data, error } = await supabase
        .from('enumeration_areas')
        .insert([{
          ...areaData,
          enumeration_status: areaData.enumeration_status || 'not_started'
        }])
        .select()
        .single()

      if (error) {
        console.error('Enumeration area creation error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as EnumerationArea }
    } catch (error) {
      console.error('Create enumeration area error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async getEnumerationAreas(province?: string): Promise<EnumerationArea[]> {
    try {
      let query = supabase.from('enumeration_areas').select('*')

      if (province) {
        query = query.eq('province', province)
      }

      const { data, error } = await query.order('area_code')

      if (error) {
        console.error('Error fetching enumeration areas:', error)
        return []
      }

      return data as EnumerationArea[]
    } catch (error) {
      console.error('Get enumeration areas error:', error)
      return []
    }
  }

  // Helper function to generate census IDs
  generateCensusId(): string {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `CENSUS${timestamp}${random}`
  }

  // Helper function to generate household numbers
  generateHouseholdNumber(enumerationArea: string): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${enumerationArea}-HH${timestamp}${random}`
  }
}

export const censusService = new CensusService()
export default censusService
