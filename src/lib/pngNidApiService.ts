'use client'

import { supabase } from './supabase'

export interface PngNidCitizen {
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
}

export interface ElectoralRollRecord {
  id: string
  nid_number: string
  full_name: string
  date_of_birth: string
  gender: 'Male' | 'Female' | 'Other'
  province: string
  district: string
  llg_ward: string
  polling_station?: string
  registration_date: string
  photo_url?: string
  fingerprint_data?: string
  signature_data?: string
  is_verified: boolean
  status: 'active' | 'inactive' | 'deceased' | 'suspended'
  source: 'png_nid' | 'manual_registration'
  last_updated: string
}

class PngNidApiService {
  private apiBaseUrl: string
  private apiKey: string

  constructor() {
    // Configure PNG NID API endpoint (replace with actual production endpoint)
    this.apiBaseUrl = process.env.NEXT_PUBLIC_PNG_NID_API_URL || 'https://api.pngnid.gov.pg/v1'
    this.apiKey = process.env.NEXT_PUBLIC_PNG_NID_API_KEY || ''
  }

  /**
   * Search PNG NID system by NID number
   */
  async searchByNidNumber(nidNumber: string): Promise<{ success: boolean; data?: PngNidCitizen; error?: string }> {
    try {
      // TODO: Replace with actual PNG NID API call when endpoint is available
      const response = await fetch(`${this.apiBaseUrl}/citizens/search/nid/${nidNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'NID not found in PNG NID system' }
        }
        throw new Error(`PNG NID API error: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data: data as PngNidCitizen }
    } catch (error: any) {
      console.error('PNG NID API search error:', error)
      return { success: false, error: error.message || 'Failed to connect to PNG NID system' }
    }
  }

  /**
   * Search PNG NID system by fingerprint template
   */
  async searchByFingerprint(fingerprintTemplate: string): Promise<{ success: boolean; data?: PngNidCitizen; error?: string }> {
    try {
      // TODO: Replace with actual PNG NID API call when endpoint is available
      const response = await fetch(`${this.apiBaseUrl}/citizens/search/fingerprint`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fingerprint_template: fingerprintTemplate }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'No match found in PNG NID system' }
        }
        throw new Error(`PNG NID API error: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data: data as PngNidCitizen }
    } catch (error: any) {
      console.error('PNG NID fingerprint search error:', error)
      return { success: false, error: error.message || 'Failed to connect to PNG NID system' }
    }
  }

  /**
   * Search local electoral roll database by NID number
   */
  async searchElectoralRollByNid(nidNumber: string): Promise<{ success: boolean; data?: ElectoralRollRecord; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('electoral_roll')
        .select('*')
        .eq('nid_number', nidNumber)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Not found in electoral roll' }
        }
        throw error
      }

      return { success: true, data: data as ElectoralRollRecord }
    } catch (error: any) {
      console.error('Electoral roll search error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Search local electoral roll database by fingerprint
   */
  async searchElectoralRollByFingerprint(fingerprintData: string): Promise<{ success: boolean; data?: ElectoralRollRecord; error?: string }> {
    try {
      // This would require a fingerprint matching algorithm
      // For now, we'll do a simple search
      const { data, error } = await supabase
        .from('electoral_roll')
        .select('*')
        .eq('fingerprint_data', fingerprintData)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'No fingerprint match in electoral roll' }
        }
        throw error
      }

      return { success: true, data: data as ElectoralRollRecord }
    } catch (error: any) {
      console.error('Electoral roll fingerprint search error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Import citizen from PNG NID to electoral roll
   */
  async importToElectoralRoll(nidCitizen: PngNidCitizen, pollingStation?: string): Promise<{ success: boolean; data?: ElectoralRollRecord; error?: string }> {
    try {
      const electoralRecord: Partial<ElectoralRollRecord> = {
        nid_number: nidCitizen.nid_number,
        full_name: nidCitizen.full_name,
        date_of_birth: nidCitizen.date_of_birth,
        gender: nidCitizen.gender,
        province: nidCitizen.province,
        district: nidCitizen.district,
        llg_ward: nidCitizen.llg_ward,
        polling_station: pollingStation,
        registration_date: new Date().toISOString(),
        photo_url: nidCitizen.photo_url,
        fingerprint_data: nidCitizen.fingerprint_template,
        signature_data: nidCitizen.signature_template,
        is_verified: true,
        status: nidCitizen.status === 'active' ? 'active' : 'inactive',
        source: 'png_nid',
        last_updated: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('electoral_roll')
        .insert([electoralRecord])
        .select()
        .single()

      if (error) throw error

      return { success: true, data: data as ElectoralRollRecord }
    } catch (error: any) {
      console.error('Import to electoral roll error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Manual registration to electoral roll (when not found in PNG NID)
   */
  async manualRegistration(voterData: Partial<ElectoralRollRecord>): Promise<{ success: boolean; data?: ElectoralRollRecord; error?: string }> {
    try {
      const record = {
        ...voterData,
        registration_date: new Date().toISOString(),
        is_verified: false,
        status: 'active' as const,
        source: 'manual_registration' as const,
        last_updated: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('electoral_roll')
        .insert([record])
        .select()
        .single()

      if (error) throw error

      return { success: true, data: data as ElectoralRollRecord }
    } catch (error: any) {
      console.error('Manual registration error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Update electoral roll record
   */
  async updateElectoralRecord(id: string, updates: Partial<ElectoralRollRecord>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('electoral_roll')
        .update({ ...updates, last_updated: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      console.error('Update electoral record error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get all electoral roll records with pagination
   */
  async getElectoralRoll(page = 1, limit = 50, filters?: {
    province?: string
    district?: string
    status?: string
  }): Promise<{ success: boolean; data?: ElectoralRollRecord[]; total?: number; error?: string }> {
    try {
      let query = supabase
        .from('electoral_roll')
        .select('*', { count: 'exact' })
        .order('registration_date', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (filters?.province) {
        query = query.eq('province', filters.province)
      }
      if (filters?.district) {
        query = query.eq('district', filters.district)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error, count } = await query

      if (error) throw error

      return { success: true, data: data as ElectoralRollRecord[], total: count || 0 }
    } catch (error: any) {
      console.error('Get electoral roll error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Comprehensive search workflow
   * 1. Search local electoral roll by NID/fingerprint
   * 2. If not found, query PNG NID system
   * 3. If found in PNG NID, offer to import
   */
  async comprehensiveSearch(searchCriteria: {
    nidNumber?: string
    fingerprintTemplate?: string
  }): Promise<{
    foundInElectoralRoll: boolean
    electoralRollData?: ElectoralRollRecord
    foundInPngNid: boolean
    pngNidData?: PngNidCitizen
    error?: string
  }> {
    try {
      // Step 1: Search local electoral roll
      let electoralResult: { success: boolean; data?: ElectoralRollRecord; error?: string }

      if (searchCriteria.nidNumber) {
        electoralResult = await this.searchElectoralRollByNid(searchCriteria.nidNumber)
      } else if (searchCriteria.fingerprintTemplate) {
        electoralResult = await this.searchElectoralRollByFingerprint(searchCriteria.fingerprintTemplate)
      } else {
        return { foundInElectoralRoll: false, foundInPngNid: false, error: 'No search criteria provided' }
      }

      if (electoralResult.success && electoralResult.data) {
        return {
          foundInElectoralRoll: true,
          electoralRollData: electoralResult.data,
          foundInPngNid: false,
        }
      }

      // Step 2: Search PNG NID system
      let nidResult: { success: boolean; data?: PngNidCitizen; error?: string }

      if (searchCriteria.nidNumber) {
        nidResult = await this.searchByNidNumber(searchCriteria.nidNumber)
      } else if (searchCriteria.fingerprintTemplate) {
        nidResult = await this.searchByFingerprint(searchCriteria.fingerprintTemplate)
      } else {
        return { foundInElectoralRoll: false, foundInPngNid: false }
      }

      if (nidResult.success && nidResult.data) {
        return {
          foundInElectoralRoll: false,
          foundInPngNid: true,
          pngNidData: nidResult.data,
        }
      }

      // Not found in either system
      return {
        foundInElectoralRoll: false,
        foundInPngNid: false,
        error: 'Citizen not found in electoral roll or PNG NID system',
      }
    } catch (error: any) {
      console.error('Comprehensive search error:', error)
      return {
        foundInElectoralRoll: false,
        foundInPngNid: false,
        error: error.message,
      }
    }
  }
}

export const pngNidApiService = new PngNidApiService()
export default pngNidApiService
