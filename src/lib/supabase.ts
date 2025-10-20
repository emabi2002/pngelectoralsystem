import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://usipijjyqfpxmhjbebyo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaXBpamp5cWZweG1oamJlYnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDM4NDgsImV4cCI6MjA3NTM3OTg0OH0.32LOTrvyFXPR0E7vHd57bBCB8mMbJF2978DimNEPTnQ'

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Component client for use in Client Components
export const createSupabaseClient = () => createClientComponentClient()

// Types for our database schema
export interface Database {
  public: {
    Tables: {
      // Household Census Table
      households: {
        Row: {
          id: string
          created_at: string
          updated_at: string
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
          verification_status: 'pending' | 'verified' | 'rejected'
          data_quality_score: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
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
        }
        Update: {
          updated_at?: string
          household_number?: string
          enumeration_area?: string
          province?: string
          district?: string
          llg_ward?: string
          village_settlement?: string
          dwelling_type?: 'Traditional' | 'Modern' | 'Semi-permanent' | 'Temporary' | 'Other'
          wall_material?: string
          roof_material?: string
          floor_material?: string
          number_of_rooms?: number
          water_source?: string
          toilet_facility?: string
          electricity_source?: string
          cooking_fuel?: string
          owns_dwelling?: boolean
          household_head_id?: string
          total_members?: number
          latitude?: number
          longitude?: number
          enumerator_id?: string
          enumeration_date?: string
          verification_status?: 'pending' | 'verified' | 'rejected'
          data_quality_score?: number
        }
      }
      // Population Census Table (All Ages)
      population: {
        Row: {
          id: string
          created_at: string
          updated_at: string
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
          // Disability Data (Washington Group Questions)
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
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
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
          difficulty_seeing: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_hearing: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_walking: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_remembering: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_selfcare: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_communicating: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          has_disability: boolean
          disability_type?: string[]
          receives_disability_support: boolean
          health_insurance: boolean
          chronic_illness?: string[]
          vaccination_status?: string
          photo_url?: string
          fingerprint_template?: string
          iris_scan_template?: string
          biometric_quality_score?: number
          data_source: 'census' | 'nid' | 'birth_registration' | 'manual'
          is_verified: boolean
          verification_date?: string
          verifier_id?: string
          enumeration_area: string
          enumerator_id: string
          enumeration_date: string
        }
        Update: {
          updated_at?: string
          census_id?: string
          household_id?: string
          nid_number?: string
          birth_certificate_number?: string
          full_name?: string
          date_of_birth?: string
          age?: number
          gender?: 'Male' | 'Female' | 'Other'
          relationship_to_head?: string
          marital_status?: string
          place_of_birth?: string
          nationality?: string
          ethnicity?: string
          religion?: string
          languages_spoken?: string[]
          literacy_status?: 'Literate' | 'Illiterate' | 'Partially literate'
          highest_education?: string
          current_school_attendance?: boolean
          occupation?: string
          employment_status?: string
          industry_sector?: string
          migration_status?: 'Resident' | 'Migrant' | 'Visitor'
          previous_residence?: string
          years_at_current_residence?: number
          difficulty_seeing?: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_hearing?: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_walking?: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_remembering?: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_selfcare?: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          difficulty_communicating?: 'No difficulty' | 'Some difficulty' | 'A lot of difficulty' | 'Cannot do at all'
          has_disability?: boolean
          disability_type?: string[]
          receives_disability_support?: boolean
          health_insurance?: boolean
          chronic_illness?: string[]
          vaccination_status?: string
          photo_url?: string
          fingerprint_template?: string
          iris_scan_template?: string
          biometric_quality_score?: number
          data_source?: 'census' | 'nid' | 'birth_registration' | 'manual'
          is_verified?: boolean
          verification_date?: string
          verifier_id?: string
          enumeration_area?: string
          enumerator_id?: string
          enumeration_date?: string
        }
      }
      // New citizens table for full citizen data storage (PNG NID replica)
      citizens: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          nid_number: string
          full_name: string
          date_of_birth: string
          gender: 'Male' | 'Female' | 'Other'
          place_of_birth: string
          nationality: string
          residential_address: string
          postal_address: string
          phone_number?: string
          email?: string
          marital_status: string
          occupation?: string
          education_level?: string
          next_of_kin: string
          next_of_kin_contact: string
          issue_date: string
          expiry_date: string
          issuing_authority: string
          photo_url?: string
          fingerprint_template?: string
          signature_template?: string
          status: 'active' | 'suspended' | 'expired' | 'revoked'
          province: string
          district: string
          llg_ward: string
          data_source: 'png_nid' | 'electoral_system' // Track where data came from
          is_synced_with_nid: boolean // Track if synced with PNG NID
          created_by_officer_id?: string
          verification_status: 'pending' | 'verified' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          nid_number: string
          full_name: string
          date_of_birth: string
          gender: 'Male' | 'Female' | 'Other'
          place_of_birth: string
          nationality: string
          residential_address: string
          postal_address: string
          phone_number?: string
          email?: string
          marital_status: string
          occupation?: string
          education_level?: string
          next_of_kin: string
          next_of_kin_contact: string
          issue_date: string
          expiry_date: string
          issuing_authority: string
          photo_url?: string
          fingerprint_template?: string
          signature_template?: string
          status: 'active' | 'suspended' | 'expired' | 'revoked'
          province: string
          district: string
          llg_ward: string
          data_source: 'png_nid' | 'electoral_system'
          is_synced_with_nid?: boolean
          created_by_officer_id?: string
          verification_status?: 'pending' | 'verified' | 'rejected'
        }
        Update: {
          updated_at?: string
          full_name?: string
          date_of_birth?: string
          gender?: 'Male' | 'Female' | 'Other'
          place_of_birth?: string
          nationality?: string
          residential_address?: string
          postal_address?: string
          phone_number?: string
          email?: string
          marital_status?: string
          occupation?: string
          education_level?: string
          next_of_kin?: string
          next_of_kin_contact?: string
          issue_date?: string
          expiry_date?: string
          issuing_authority?: string
          photo_url?: string
          fingerprint_template?: string
          signature_template?: string
          status?: 'active' | 'suspended' | 'expired' | 'revoked'
          province?: string
          district?: string
          llg_ward?: string
          data_source?: 'png_nid' | 'electoral_system'
          is_synced_with_nid?: boolean
          created_by_officer_id?: string
          verification_status?: 'pending' | 'verified' | 'rejected'
        }
      }
      voters: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          nid_smart_id: string
          date_of_birth: string
          gender: 'Male' | 'Female' | 'Other'
          llg_ward: string
          province: string
          district: string
          polling_station: string
          facial_image_url?: string
          fingerprint_data?: string
          signature_data?: string
          is_verified: boolean
          registration_officer_id?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name: string
          nid_smart_id: string
          date_of_birth: string
          gender: 'Male' | 'Female' | 'Other'
          llg_ward: string
          province: string
          district: string
          polling_station: string
          facial_image_url?: string
          fingerprint_data?: string
          signature_data?: string
          is_verified?: boolean
          registration_officer_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          nid_smart_id?: string
          date_of_birth?: string
          gender?: 'Male' | 'Female' | 'Other'
          llg_ward?: string
          province?: string
          district?: string
          polling_station?: string
          facial_image_url?: string
          fingerprint_data?: string
          signature_data?: string
          is_verified?: boolean
          registration_officer_id?: string
        }
      }
      polling_results: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          polling_station: string
          province: string
          district: string
          total_registered_voters: number
          total_votes_cast: number
          candidate_results: Record<string, number> // JSON object with candidate vote counts
          polling_officer_id: string
          is_transmitted: boolean
          transmitted_at?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          polling_station: string
          province: string
          district: string
          total_registered_voters: number
          total_votes_cast: number
          candidate_results: Record<string, number>
          polling_officer_id: string
          is_transmitted?: boolean
          transmitted_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          polling_station?: string
          province?: string
          district?: string
          total_registered_voters?: number
          total_votes_cast?: number
          candidate_results?: Record<string, number>
          polling_officer_id?: string
          is_transmitted?: boolean
          transmitted_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string
          action: string
          table_name: string
          record_id: string
          old_values?: Record<string, unknown>
          new_values?: Record<string, unknown>
          ip_address?: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          action: string
          table_name: string
          record_id: string
          old_values?: Record<string, unknown>
          new_values?: Record<string, unknown>
          ip_address?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          action?: string
          table_name?: string
          record_id?: string
          old_values?: Record<string, unknown>
          new_values?: Record<string, unknown>
          ip_address?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'polling_officer' | 'observer'
    }
  }
}
