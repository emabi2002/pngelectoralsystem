'use client'

import { createSupabaseClient } from './supabase'
import { demoFaceRecognitionService, type FaceDescriptor } from './faceRecognitionDemo'

export interface VoterRegistration {
  id?: string
  full_name: string
  nid_smart_id: string
  date_of_birth: string
  gender: 'Male' | 'Female' | 'Other'
  llg_ward: string
  province: string
  district: string
  polling_station: string
  facial_image_url?: string
  face_descriptor?: string
  fingerprint_data?: string
  signature_data?: string
  face_quality_score?: number
  is_verified?: boolean
  registration_officer_id?: string
  created_at?: string
}

// New comprehensive citizen data interface (PNG NID replica)
export interface CitizenData {
  id?: string
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
  created_at?: string
  updated_at?: string
}

export interface PollingResult {
  id?: string
  polling_station: string
  province: string
  district: string
  total_registered_voters: number
  total_votes_cast: number
  candidate_results: Record<string, number>
  polling_officer_id: string
  is_transmitted?: boolean
  transmitted_at?: string
  created_at?: string
}

export interface AuditLog {
  id?: string
  user_id: string
  action: string
  table_name: string
  record_id: string
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  created_at?: string
}

class DatabaseService {
  private supabase = createSupabaseClient()

  // PNG NID Citizen Registration Functions
  async registerCitizen(citizenData: Omit<CitizenData, 'id' | 'created_at' | 'updated_at' | 'issue_date' | 'expiry_date' | 'issuing_authority' | 'status'>): Promise<{
    success: boolean
    data?: CitizenData
    error?: string
  }> {
    try {
      // Check if NID already exists
      const existingCitizen = await this.getCitizenByNID(citizenData.nid_number)
      if (existingCitizen) {
        return {
          success: false,
          error: 'NID number already exists in the system'
        }
      }

      const { data, error } = await this.supabase
        .from('citizens')
        .insert([{
          nid_number: citizenData.nid_number,
          full_name: citizenData.full_name,
          date_of_birth: citizenData.date_of_birth,
          gender: citizenData.gender,
          place_of_birth: citizenData.place_of_birth,
          nationality: citizenData.nationality,
          residential_address: citizenData.residential_address,
          postal_address: citizenData.postal_address,
          phone_number: citizenData.phone_number,
          email: citizenData.email,
          marital_status: citizenData.marital_status,
          occupation: citizenData.occupation,
          education_level: citizenData.education_level,
          next_of_kin: citizenData.next_of_kin,
          next_of_kin_contact: citizenData.next_of_kin_contact,
          province: citizenData.province,
          district: citizenData.district,
          llg_ward: citizenData.llg_ward,
          photo_url: citizenData.photo_url,
          fingerprint_template: citizenData.fingerprint_template,
          signature_template: citizenData.signature_template,
          issue_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 years
          issuing_authority: 'PNG Civil Registry Office - Digital Electoral System',
          status: 'active',
          data_source: 'electoral_system',
          created_by_officer_id: 'SYSTEM',
          verification_status: 'pending'
        }])
        .select()
        .single()

      if (error) {
        console.error('Citizen registration error:', error)
        return {
          success: false,
          error: 'Failed to register citizen data'
        }
      }

      // Log the citizen registration
      await this.logAction('INSERT', 'citizens', data.id, null, data)

      return {
        success: true,
        data: data as CitizenData
      }
    } catch (error) {
      console.error('Citizen registration error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred during citizen registration'
      }
    }
  }

  async getCitizenByNID(nidNumber: string): Promise<CitizenData | null> {
    try {
      const { data, error } = await this.supabase
        .from('citizens')
        .select('*')
        .eq('nid_number', nidNumber)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - citizen not found
          return null
        }
        console.error('Error fetching citizen by NID:', error)
        return null
      }

      return data as CitizenData
    } catch (error) {
      console.error('Get citizen by NID error:', error)
      return null
    }
  }

  // Enhanced Citizen Management Functions
  async getAllCitizens(page: number = 1, limit: number = 50): Promise<{
    citizens: CitizenData[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const offset = (page - 1) * limit

      // Get total count
      const { count } = await this.supabase
        .from('citizens')
        .select('*', { count: 'exact', head: true })

      // Get paginated data
      const { data, error } = await this.supabase
        .from('citizens')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching citizens:', error)
        return { citizens: [], total: 0, page, totalPages: 0 }
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return {
        citizens: data as CitizenData[],
        total: count || 0,
        page,
        totalPages
      }
    } catch (error) {
      console.error('Get all citizens error:', error)
      return { citizens: [], total: 0, page, totalPages: 0 }
    }
  }

  async updateCitizenVerificationStatus(
    nidNumber: string,
    status: 'pending' | 'verified' | 'rejected',
    officerId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('citizens')
        .update({
          verification_status: status,
          created_by_officer_id: officerId,
          updated_at: new Date().toISOString()
        })
        .eq('nid_number', nidNumber)

      if (error) {
        console.error('Error updating citizen verification status:', error)
        return { success: false, error: 'Failed to update verification status' }
      }

      return { success: true }
    } catch (error) {
      console.error('Update citizen verification status error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async markCitizenSyncedWithNID(nidNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('citizens')
        .update({
          is_synced_with_nid: true,
          data_source: 'png_nid',
          updated_at: new Date().toISOString()
        })
        .eq('nid_number', nidNumber)

      if (error) {
        console.error('Error marking citizen as synced with NID:', error)
        return { success: false, error: 'Failed to update sync status' }
      }

      return { success: true }
    } catch (error) {
      console.error('Mark citizen synced error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async getCitizensForNIDExport(): Promise<CitizenData[]> {
    try {
      const { data, error } = await this.supabase
        .from('citizens')
        .select('*')
        .eq('data_source', 'electoral_system')
        .eq('is_synced_with_nid', false)
        .eq('verification_status', 'verified')

      if (error) {
        console.error('Error getting citizens for NID export:', error)
        return []
      }

      return data as CitizenData[]
    } catch (error) {
      console.error('Get citizens for NID export error:', error)
      return []
    }
  }

  async searchCitizens(searchTerm: string): Promise<CitizenData[]> {
    try {
      const { data, error } = await this.supabase
        .from('citizens')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,nid_number.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`)
        .order('full_name')
        .limit(50)

      if (error) {
        console.error('Error searching citizens:', error)
        return []
      }

      return data as CitizenData[]
    } catch (error) {
      console.error('Search citizens error:', error)
      return []
    }
  }

  // Voter Registration Functions
  async registerVoter(voterData: {
    nid_smart_id: string
    polling_station: string
    province: string
    district: string
    llg_ward: string
    facial_image_url?: string
    face_descriptor?: string
    face_quality_score?: number
    registration_officer_id?: string
  }): Promise<{
    success: boolean
    data?: VoterRegistration
    error?: string
    isDuplicate?: boolean
    duplicateMatch?: string
  }> {
    try {
      // Check if voter is already registered
      const existingVoter = await this.getVoterByNID(voterData.nid_smart_id)

      if (existingVoter) {
        return {
          success: false,
          isDuplicate: true,
          error: 'Voter already registered on electoral roll',
          duplicateMatch: `${existingVoter.full_name} - ${existingVoter.polling_station}`
        }
      }

      // Check for duplicate faces if face descriptor provided
      if (voterData.face_descriptor) {
        const duplicateCheck = await this.checkForDuplicateVoter(voterData.face_descriptor)
        if (duplicateCheck.isDuplicate && duplicateCheck.matchedVoter) {
          return {
            success: false,
            isDuplicate: true,
            error: 'Facial biometric matches existing registration',
            duplicateMatch: `${duplicateCheck.matchedVoter.full_name} (${(duplicateCheck.confidence || 0).toFixed(1)}% match)`
          }
        }
      }

      // Insert only electoral roll specific data
      const { data, error } = await this.supabase
        .from('voters')
        .insert([{
          nid_smart_id: voterData.nid_smart_id,
          polling_station: voterData.polling_station,
          province: voterData.province,
          district: voterData.district,
          llg_ward: voterData.llg_ward,
          facial_image_url: voterData.facial_image_url,
          face_descriptor: voterData.face_descriptor,
          face_quality_score: voterData.face_quality_score || 0,
          registration_officer_id: voterData.registration_officer_id || 'SYSTEM',
          is_verified: false,
          // These will be populated from NID lookup when needed
          full_name: '', // Will be fetched from NID
          date_of_birth: '1900-01-01', // Will be fetched from NID
          gender: 'Other' // Will be fetched from NID
        }])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        return {
          success: false,
          error: 'Failed to register voter. Please try again.'
        }
      }

      // Log the registration
      await this.logAction('INSERT', 'voters', data.id, null, data)

      return {
        success: true,
        data: data as VoterRegistration
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred during registration.'
      }
    }
  }

  async checkForDuplicateVoter(faceDescriptor: string): Promise<{
    isDuplicate: boolean
    matchedVoter?: VoterRegistration
    confidence?: number
  }> {
    try {
      // Get all existing face descriptors
      const { data: existingVoters, error } = await this.supabase
        .from('voters')
        .select('id, full_name, face_descriptor, face_quality_score')
        .not('face_descriptor', 'is', null)

      if (error || !existingVoters) {
        console.error('Error fetching existing voters:', error)
        return { isDuplicate: false }
      }

      // Convert stored descriptors and compare
      const newDescriptor = demoFaceRecognitionService.base64ToDescriptor(faceDescriptor)
      const existingDescriptors: FaceDescriptor[] = existingVoters
        .filter(voter => voter.face_descriptor)
        .map(voter => ({
          id: voter.id,
          descriptor: demoFaceRecognitionService.base64ToDescriptor(voter.face_descriptor!),
          confidence: voter.face_quality_score || 0,
          detectedAt: '',
          boundingBox: { x: 0, y: 0, width: 0, height: 0 }
        }))

      const duplicateCheck = await demoFaceRecognitionService.checkForDuplicates(
        newDescriptor,
        existingDescriptors
      )

      if (duplicateCheck.isDuplicate && duplicateCheck.bestMatch) {
        const matchedVoter = existingVoters.find(v => v.id === duplicateCheck.bestMatch!.personId)
        return {
          isDuplicate: true,
          matchedVoter: matchedVoter as VoterRegistration,
          confidence: duplicateCheck.bestMatch.confidence
        }
      }

      return { isDuplicate: false }
    } catch (error) {
      console.error('Duplicate check error:', error)
      return { isDuplicate: false }
    }
  }

  // Get voter by NID number
  async getVoterByNID(nidNumber: string): Promise<VoterRegistration | null> {
    try {
      const { data, error } = await this.supabase
        .from('voters')
        .select('*')
        .eq('nid_smart_id', nidNumber)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - voter not found
          return null
        }
        console.error('Error fetching voter by NID:', error)
        return null
      }

      return data as VoterRegistration
    } catch (error) {
      console.error('Get voter by NID error:', error)
      return null
    }
  }

  // Get voter with citizen data from both local and external sources
  async getVoterWithCitizenData(nidNumber: string): Promise<{
    voter?: VoterRegistration
    citizen?: CitizenData
  } | null> {
    try {
      // Get voter registration data
      const voter = await this.getVoterByNID(nidNumber)

      // Get citizen data (first try local storage)
      let citizen = await this.getCitizenByNID(nidNumber)

      if (!citizen) {
        // If not in our local system, try the simulated PNG NID lookup
        const { nidService } = await import('@/lib/nidService')
        const nidResponse = await nidService.lookupCitizen(nidNumber)
        if (nidResponse.found && nidResponse.citizen) {
          // Convert external format to our internal format
          const externalCitizen = nidResponse.citizen
          citizen = {
            nid_number: externalCitizen.nid_number,
            full_name: externalCitizen.full_name,
            date_of_birth: externalCitizen.date_of_birth,
            gender: externalCitizen.gender,
            place_of_birth: externalCitizen.place_of_birth,
            nationality: externalCitizen.nationality,
            residential_address: externalCitizen.residential_address,
            postal_address: externalCitizen.postal_address,
            phone_number: externalCitizen.phone_number,
            email: externalCitizen.email,
            marital_status: externalCitizen.marital_status,
            occupation: externalCitizen.occupation,
            education_level: externalCitizen.education_level,
            next_of_kin: externalCitizen.next_of_kin,
            next_of_kin_contact: externalCitizen.next_of_kin_contact,
            province: externalCitizen.province,
            district: externalCitizen.district,
            llg_ward: externalCitizen.llg_ward,
            status: externalCitizen.status,
            issue_date: externalCitizen.issue_date,
            expiry_date: externalCitizen.expiry_date,
            issuing_authority: externalCitizen.issuing_authority,
            data_source: 'png_nid',
            is_synced_with_nid: true,
            verification_status: 'verified'
          }
        }
      }

      return {
        voter: voter || undefined,
        citizen: citizen || undefined
      }
    } catch (error) {
      console.error('Error getting voter with citizen data:', error)
      return null
    }
  }

  async getVoterStats(): Promise<{
    totalRegistered: number
    byProvince: Record<string, number>
    recentRegistrations: number
  }> {
    try {
      const { data: allVoters, error } = await this.supabase
        .from('voters')
        .select('province, created_at')

      if (error || !allVoters) {
        return { totalRegistered: 0, byProvince: {}, recentRegistrations: 0 }
      }

      const byProvince: Record<string, number> = {}
      let recentRegistrations = 0
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      allVoters.forEach(voter => {
        byProvince[voter.province] = (byProvince[voter.province] || 0) + 1
        if (new Date(voter.created_at) > oneDayAgo) {
          recentRegistrations++
        }
      })

      return {
        totalRegistered: allVoters.length,
        byProvince,
        recentRegistrations
      }
    } catch (error) {
      console.error('Error fetching voter stats:', error)
      return { totalRegistered: 0, byProvince: {}, recentRegistrations: 0 }
    }
  }

  // Polling Results Functions
  async submitPollingResults(resultsData: PollingResult): Promise<{
    success: boolean
    data?: PollingResult
    error?: string
  }> {
    try {
      const { data, error } = await this.supabase
        .from('polling_results')
        .insert([{
          polling_station: resultsData.polling_station,
          province: resultsData.province,
          district: resultsData.district,
          total_registered_voters: resultsData.total_registered_voters,
          total_votes_cast: resultsData.total_votes_cast,
          candidate_results: resultsData.candidate_results,
          polling_officer_id: resultsData.polling_officer_id,
          is_transmitted: true,
          transmitted_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Polling results submission error:', error)
        return {
          success: false,
          error: 'Failed to submit polling results. Please try again.'
        }
      }

      // Log the submission
      await this.logAction('INSERT', 'polling_results', data.id, null, data)

      return {
        success: true,
        data: data as PollingResult
      }
    } catch (error) {
      console.error('Polling results error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred while submitting results.'
      }
    }
  }

  async getPollingResults(): Promise<PollingResult[]> {
    try {
      const { data, error } = await this.supabase
        .from('polling_results')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data) {
        console.error('Error fetching polling results:', error)
        return []
      }

      return data as PollingResult[]
    } catch (error) {
      console.error('Error fetching polling results:', error)
      return []
    }
  }

  async getElectionStats(): Promise<{
    totalStations: number
    transmittedStations: number
    totalVotesCast: number
    candidateResults: Record<string, number>
    provinceResults: Record<string, { votes: number, stations: number }>
  }> {
    try {
      const { data: results, error } = await this.supabase
        .from('polling_results')
        .select('*')

      if (error || !results) {
        return {
          totalStations: 0,
          transmittedStations: 0,
          totalVotesCast: 0,
          candidateResults: {},
          provinceResults: {}
        }
      }

      const candidateResults: Record<string, number> = {}
      const provinceResults: Record<string, { votes: number, stations: number }> = {}
      let totalVotesCast = 0

      results.forEach(result => {
        totalVotesCast += result.total_votes_cast

        // Aggregate candidate results
        Object.entries(result.candidate_results).forEach(([candidate, votes]) => {
          candidateResults[candidate] = (candidateResults[candidate] || 0) + (votes as number)
        })

        // Aggregate province results
        if (!provinceResults[result.province]) {
          provinceResults[result.province] = { votes: 0, stations: 0 }
        }
        provinceResults[result.province].votes += result.total_votes_cast
        provinceResults[result.province].stations += 1
      })

      return {
        totalStations: 23874, // Mock total stations
        transmittedStations: results.length,
        totalVotesCast,
        candidateResults,
        provinceResults
      }
    } catch (error) {
      console.error('Error fetching election stats:', error)
      return {
        totalStations: 0,
        transmittedStations: 0,
        totalVotesCast: 0,
        candidateResults: {},
        provinceResults: {}
      }
    }
  }

  // Audit Log Functions
  async logAction(
    action: string,
    tableName: string,
    recordId: string,
    oldValues?: Record<string, unknown> | null,
    newValues?: Record<string, unknown> | null
  ): Promise<void> {
    try {
      await this.supabase
        .from('audit_logs')
        .insert([{
          user_id: 'demo-user', // In real app, get from auth
          action,
          table_name: tableName,
          record_id: recordId,
          old_values: oldValues,
          new_values: newValues,
          ip_address: '127.0.0.1' // In real app, get actual IP
        }])
    } catch (error) {
      console.error('Audit logging error:', error)
      // Don't throw - audit logging shouldn't break main functionality
    }
  }

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error || !data) {
        console.error('Error fetching audit logs:', error)
        return []
      }

      return data as AuditLog[]
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      return []
    }
  }

  // Real-time Subscriptions
  subscribeToElectionResults(callback: (payload: Record<string, unknown>) => void) {
    return this.supabase
      .channel('polling_results')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'polling_results' },
        callback
      )
      .subscribe()
  }

  subscribeToVoterRegistrations(callback: (payload: Record<string, unknown>) => void) {
    return this.supabase
      .channel('voters')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'voters' },
        callback
      )
      .subscribe()
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()
export default DatabaseService
