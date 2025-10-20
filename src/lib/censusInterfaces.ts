// PNG Population Census Data Interfaces
// Following UN Principles and Recommendations for Population and Housing Censuses
// Including Washington Group Disability Questions

// Household Census Data
export interface HouseholdData {
  id?: string
  household_number: string
  enumeration_area: string
  province: string
  district: string
  llg_ward: string
  village_settlement: string
  dwelling_type: 'Traditional' | 'Modern' | 'Semi-permanent' | 'Temporary' | 'Other'
  wall_material: string
  roof_material: string
  floor_material: string
  number_of_rooms: number
  water_source: string
  toilet_facility: string
  electricity_source: string
  cooking_fuel: string
  owns_dwelling: boolean
  household_head_id?: string
  total_members: number
  latitude?: number
  longitude?: number
  enumerator_id: string
  enumeration_date: string
  verification_status?: 'pending' | 'verified' | 'rejected'
  data_quality_score?: number
  created_at?: string
  updated_at?: string
}

// Population Census Data (All Ages, Disability Inclusive)
export interface PopulationData {
  id?: string
  census_id: string
  household_id: string
  nid_number?: string
  birth_certificate_number?: string
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
  literacy_status: 'Literate' | 'Illiterate' | 'Partially literate'
  highest_education: string
  current_school_attendance: boolean
  occupation?: string
  employment_status: string
  industry_sector?: string
  migration_status: 'Resident' | 'Migrant' | 'Visitor'
  previous_residence?: string
  years_at_current_residence: number
  // Disability Data (Washington Group Short Set Questions)
  difficulty_seeing: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_hearing: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_walking: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_remembering: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_selfcare: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  difficulty_communicating: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
  has_disability: boolean
  disability_type?: string[]
  receives_disability_support: boolean
  // Health & Vital Statistics
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
  created_at?: string
  updated_at?: string
}

// Census Statistics Summary
export interface CensusStatistics {
  totalPopulation: number
  totalHouseholds: number
  malePopulation: number
  femalePopulation: number
  averageHouseholdSize: number
  populationByAgeGroup: {
    '0-4': number
    '5-14': number
    '15-24': number
    '25-54': number
    '55-64': number
    '65+': number
  }
  populationWithDisability: number
  disabilityByType: {
    seeing: number
    hearing: number
    walking: number
    remembering: number
    selfcare: number
    communicating: number
  }
  literacyRate: number
  schoolAttendanceRate: number
  employmentRate: number
  householdsByDwellingType: {
    Traditional: number
    Modern: number
    'Semi-permanent': number
    Temporary: number
    Other: number
  }
  accessToBasicServices: {
    electricity: number
    cleanWater: number
    toilet: number
  }
}

// Enumeration Area
export interface EnumerationArea {
  id?: string
  area_code: string
  area_name: string
  province: string
  district: string
  llg_ward: string
  estimated_population: number
  estimated_households: number
  terrain_type: 'Urban' | 'Rural' | 'Remote'
  accessibility: 'Easy' | 'Moderate' | 'Difficult' | 'Very difficult'
  assigned_enumerator_id?: string
  enumeration_status: 'not_started' | 'in_progress' | 'completed' | 'verified'
  start_date?: string
  completion_date?: string
  latitude?: number
  longitude?: number
  created_at?: string
  updated_at?: string
}

// Constants for Census Forms
export const RELATIONSHIP_TO_HEAD = [
  'Head',
  'Spouse',
  'Son/Daughter',
  'Parent',
  'Grandchild',
  'Sibling',
  'Other relative',
  'Not related'
] as const

export const MARITAL_STATUS_OPTIONS = [
  'Never married',
  'Married',
  'Living together',
  'Widowed',
  'Divorced',
  'Separated'
] as const

export const EMPLOYMENT_STATUS = [
  'Employed full-time',
  'Employed part-time',
  'Self-employed',
  'Unemployed seeking work',
  'Student',
  'Homemaker',
  'Retired',
  'Unable to work',
  'Too young to work'
] as const

export const EDUCATION_LEVELS = [
  'No education',
  'Elementary (1-6)',
  'Primary (7-8)',
  'Secondary (9-10)',
  'High school (11-12)',
  'Vocational/Technical',
  'Tertiary/University',
  'Postgraduate'
] as const

export const WATER_SOURCES = [
  'Piped water',
  'Protected well',
  'Unprotected well',
  'River/Stream',
  'Rainwater',
  'Bottled water',
  'Other'
] as const

export const TOILET_FACILITIES = [
  'Flush toilet',
  'Pit latrine',
  'Composting toilet',
  'Bush/Open defecation',
  'Shared facility',
  'Other'
] as const

export const COOKING_FUELS = [
  'Electricity',
  'LPG/Gas',
  'Kerosene',
  'Firewood',
  'Charcoal',
  'Solar',
  'Other'
] as const

export const PNG_ETHNICITIES = [
  'Papuan',
  'Melanesian',
  'Micronesian',
  'Polynesian',
  'European',
  'Asian',
  'Mixed',
  'Other'
] as const

export const PNG_RELIGIONS = [
  'Catholic',
  'Lutheran',
  'United Church',
  'Seventh-day Adventist',
  'Pentecostal',
  'Anglican',
  'Baptist',
  'Evangelical',
  'Other Christian',
  'Traditional beliefs',
  'Other',
  'None'
] as const

export const DIFFICULTY_LEVELS = [
  'No difficulty',
  'Some difficulty',
  'A lot of difficulty',
  'Cannot do at all'
] as const

export const DISABILITY_TYPES = [
  'Visual impairment',
  'Hearing impairment',
  'Physical/Mobility disability',
  'Intellectual disability',
  'Mental health condition',
  'Speech impairment',
  'Multiple disabilities',
  'Other'
] as const
