// PNG National ID Service - Enhanced Edition
// This service integrates with the PNG NID system to retrieve citizen information
// And provides fallback registration for citizens not yet in the NID system

import { databaseService, type CitizenData } from './database'
import { generateEvidenceToken } from './security'

interface NIDCitizen {
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
  // Administrative location info
  province: string
  district: string
  llg_ward: string
  eligibility_for_voting: boolean
  age: number
}

interface NIDLookupResult {
  found: boolean
  citizen?: NIDCitizen
  error?: string
  source: 'png_nid' | 'electoral_system' | 'not_found'
}

interface NewCitizenRegistration {
  nid_number?: string // Will be generated if not provided
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
  province: string
  district: string
  llg_ward: string
  photo_url?: string
  fingerprint_template?: string
  signature_template?: string
}

export class NIDService {
  private readonly API_BASE_URL = 'https://api.nid.gov.pg/v1'
  private readonly API_TIMEOUT = 10000

  // Demo citizens data for simulation
  private readonly demoCitizens: NIDCitizen[] = [
    {
      nid_number: 'PNG12345678',
      full_name: 'John Kila',
      date_of_birth: '1985-03-15',
      gender: 'Male',
      place_of_birth: 'Port Moresby',
      nationality: 'Papua New Guinean',
      residential_address: 'Section 2, Hohola, Port Moresby, NCD',
      postal_address: 'PO Box 123, Port Moresby NCD',
      phone_number: '+675 72345678',
      email: 'john.kila@email.com',
      marital_status: 'Married',
      occupation: 'Government Officer',
      education_level: 'University degree',
      next_of_kin: 'Mary Kila (Wife)',
      next_of_kin_contact: '+675 72345679',
      issue_date: '2020-01-15',
      expiry_date: '2030-01-15',
      issuing_authority: 'PNG Civil Registry Office',
      photo_url: 'https://ext.same-assets.com/png-citizen-photo-1.jpg',
      fingerprint_template: 'demo_template_1',
      signature_template: 'demo_signature_1',
      status: 'active',
      province: 'National Capital District',
      district: 'Moresby North-East',
      llg_ward: 'Hohola Ward 2',
      eligibility_for_voting: true,
      age: 39
    },
    // Add more demo citizens as needed...
  ]

  async lookupCitizen(nidNumber: string): Promise<NIDLookupResult> {
    try {
      // First, try to find in our local electoral system database
      const localCitizen = await databaseService.getCitizenByNID(nidNumber)
      if (localCitizen) {
        const evidence = generateEvidenceToken({ subject: nidNumber, action: 'LOCAL_LOOKUP', timestamp: new Date().toISOString() }, 0.99)
        await databaseService.logAction('NID_LOOKUP', 'citizens', nidNumber, null, { source: localCitizen.data_source, evidence_token: evidence })
        return {
          found: true,
          citizen: this.convertCitizenDataToNIDCitizen(localCitizen),
          source: localCitizen.data_source
        }
      }

      // Then try the official PNG NID system (simulated)
      const demoCitizen = this.demoCitizens.find(c => c.nid_number === nidNumber)

      if (demoCitizen) {
        // Store this citizen in our local database for future reference
        await this.storeCitizenFromNID(demoCitizen)

        const evidence = generateEvidenceToken({ subject: nidNumber, action: 'NID_LOOKUP', timestamp: new Date().toISOString() }, 0.92)
        await databaseService.logAction('NID_LOOKUP', 'citizens', nidNumber, null, { source: 'png_nid', evidence_token: evidence })

        return {
          found: true,
          citizen: demoCitizen,
          source: 'png_nid'
        }
      }

      // Citizen not found in either system
      await databaseService.logAction('NID_LOOKUP', 'citizens', nidNumber, null, { source: 'not_found' })
      return {
        found: false,
        source: 'not_found'
      }
    } catch (error) {
      console.error('NID lookup error:', error)
      await databaseService.logAction('ERROR', 'citizens', nidNumber, null, { error: 'NID service temporarily unavailable' })
      return {
        found: false,
        error: 'NID service temporarily unavailable',
        source: 'not_found'
      }
    }
  }

  async registerNewCitizen(citizenData: NewCitizenRegistration): Promise<{
    success: boolean
    nidNumber?: string
    citizen?: NIDCitizen
    error?: string
  }> {
    try {
      // Generate new NID number
      const nidNumber = citizenData.nid_number || this.generateNIDNumber()

      // Check if NID number already exists
      const existingCheck = await this.lookupCitizen(nidNumber)
      if (existingCheck.found) {
        return {
          success: false,
          error: 'NID number already exists'
        }
      }

      // Calculate age for voting eligibility
      const age = this.calculateAge(citizenData.date_of_birth)
      const votingEligible = age >= 18

      // Create citizen data for database storage
      const newCitizenData: CitizenData = {
        nid_number: nidNumber,
        full_name: citizenData.full_name,
        date_of_birth: citizenData.date_of_birth,
        gender: citizenData.gender,
        place_of_birth: citizenData.place_of_birth,
        nationality: citizenData.nationality || 'Papua New Guinean',
        residential_address: citizenData.residential_address,
        postal_address: citizenData.postal_address,
        phone_number: citizenData.phone_number,
        email: citizenData.email,
        marital_status: citizenData.marital_status,
        occupation: citizenData.occupation,
        education_level: citizenData.education_level,
        next_of_kin: citizenData.next_of_kin,
        next_of_kin_contact: citizenData.next_of_kin_contact,
        issue_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 years
        issuing_authority: 'PNG Electoral System - Digital Registration',
        photo_url: citizenData.photo_url,
        fingerprint_template: citizenData.fingerprint_template,
        signature_template: citizenData.signature_template,
        status: 'active',
        province: citizenData.province,
        district: citizenData.district,
        llg_ward: citizenData.llg_ward,
        data_source: 'electoral_system',
        is_synced_with_nid: false,
        verification_status: 'pending'
      }

      // Register in database
      const result = await databaseService.registerCitizen(newCitizenData)

      if (result.success && result.data) {
        const nidCitizen = this.convertCitizenDataToNIDCitizen(result.data)

        return {
          success: true,
          nidNumber,
          citizen: nidCitizen
        }
      } else {
        return {
          success: false,
          error: result.error || 'Failed to register citizen'
        }
      }
    } catch (error) {
      console.error('New citizen registration error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred during registration'
      }
    }
  }

  generateNIDNumber(): string {
    // Generate a new NID number with PNG format: PNG + 8 digits
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `PNG${timestamp}${random}`
  }

  private convertCitizenDataToNIDCitizen(citizen: CitizenData): NIDCitizen {
    const age = this.calculateAge(citizen.date_of_birth)

    return {
      nid_number: citizen.nid_number,
      full_name: citizen.full_name,
      date_of_birth: citizen.date_of_birth,
      gender: citizen.gender,
      place_of_birth: citizen.place_of_birth,
      nationality: citizen.nationality,
      residential_address: citizen.residential_address,
      postal_address: citizen.postal_address,
      phone_number: citizen.phone_number,
      email: citizen.email,
      marital_status: citizen.marital_status,
      occupation: citizen.occupation,
      education_level: citizen.education_level,
      next_of_kin: citizen.next_of_kin,
      next_of_kin_contact: citizen.next_of_kin_contact,
      issue_date: citizen.issue_date,
      expiry_date: citizen.expiry_date,
      issuing_authority: citizen.issuing_authority,
      photo_url: citizen.photo_url,
      fingerprint_template: citizen.fingerprint_template,
      signature_template: citizen.signature_template,
      status: citizen.status,
      province: citizen.province,
      district: citizen.district,
      llg_ward: citizen.llg_ward,
      eligibility_for_voting: age >= 18 && citizen.status === 'active',
      age
    }
  }

  private async storeCitizenFromNID(nidCitizen: NIDCitizen): Promise<void> {
    try {
      const citizenData: CitizenData = {
        nid_number: nidCitizen.nid_number,
        full_name: nidCitizen.full_name,
        date_of_birth: nidCitizen.date_of_birth,
        gender: nidCitizen.gender,
        place_of_birth: nidCitizen.place_of_birth,
        nationality: nidCitizen.nationality,
        residential_address: nidCitizen.residential_address,
        postal_address: nidCitizen.postal_address,
        phone_number: nidCitizen.phone_number,
        email: nidCitizen.email,
        marital_status: nidCitizen.marital_status,
        occupation: nidCitizen.occupation,
        education_level: nidCitizen.education_level,
        next_of_kin: nidCitizen.next_of_kin,
        next_of_kin_contact: nidCitizen.next_of_kin_contact,
        issue_date: nidCitizen.issue_date,
        expiry_date: nidCitizen.expiry_date,
        issuing_authority: nidCitizen.issuing_authority,
        photo_url: nidCitizen.photo_url,
        fingerprint_template: nidCitizen.fingerprint_template,
        signature_template: nidCitizen.signature_template,
        status: nidCitizen.status,
        province: nidCitizen.province,
        district: nidCitizen.district,
        llg_ward: nidCitizen.llg_ward,
        data_source: 'png_nid',
        is_synced_with_nid: true,
        verification_status: 'verified'
      }

      await databaseService.registerCitizen(citizenData)
    } catch (error) {
      console.error('Error storing citizen from NID:', error)
      // Don't throw error as this is background operation
    }
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  /**
   * Demo simulation of PNG NID system lookup
   * In production, this would be replaced with actual API calls
   */
  private async simulateNIDLookup(nidNumber: string): Promise<{
    found: boolean
    citizen?: NIDCitizen
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Demo data based on NID number
    const demoProvinces = [
      'National Capital District',
      'Western',
      'Gulf',
      'Central',
      'Milne Bay',
      'Oro',
      'Southern Highlands',
      'Western Highlands',
      'Enga',
      'Simbu',
      'Eastern Highlands',
      'Morobe',
      'Madang',
      'East Sepik',
      'West Sepik',
      'Manus',
      'New Ireland',
      'East New Britain',
      'West New Britain',
      'Bougainville',
      'Hela',
      'Jiwaka'
    ]

    const demoNames = [
      'Peter Kaupa', 'Mary Temu', 'James Namaliu', 'Grace Mekere',
      'Michael Somare', 'Rose Kerenga', 'Thomas Agarobe', 'Helen Siaguru',
      'John Waigani', 'Agnes Mekere', 'Paul Tiensten', 'Rebecca Natera'
    ]

    // Generate demo citizen data
    const provinceIndex = parseInt(nidNumber.slice(-2)) % demoProvinces.length
    const nameIndex = parseInt(nidNumber.slice(-1)) % demoNames.length

    const citizen: NIDCitizen = {
      nid_number: nidNumber,
      full_name: demoNames[nameIndex],
      date_of_birth: this.generateDemoBirthDate(),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      place_of_birth: demoProvinces[provinceIndex],
      nationality: 'Papua New Guinea',
      residential_address: `${Math.floor(Math.random() * 999) + 1} ${['Hubert Murray', 'Independence', 'Waigani', 'Gordon'][Math.floor(Math.random() * 4)]} Drive, ${demoProvinces[provinceIndex]}`,
      postal_address: `PO Box ${Math.floor(Math.random() * 9999) + 1}, ${demoProvinces[provinceIndex]}`,
      phone_number: `+675 ${Math.floor(Math.random() * 90000000) + 10000000}`,
      email: `${demoNames[nameIndex].toLowerCase().replace(' ', '.')}@email.pg`,
      marital_status: ['Single', 'Married', 'Divorced', 'Widowed'][Math.floor(Math.random() * 4)],
      occupation: ['Teacher', 'Farmer', 'Business Owner', 'Public Servant', 'Student'][Math.floor(Math.random() * 5)],
      education_level: ['Primary', 'Secondary', 'Diploma', 'Degree', 'Postgraduate'][Math.floor(Math.random() * 5)],
      next_of_kin: `${['John', 'Mary', 'Peter', 'Grace'][Math.floor(Math.random() * 4)]} ${['Smith', 'Brown', 'Wilson', 'Johnson'][Math.floor(Math.random() * 4)]}`,
      next_of_kin_contact: `+675 ${Math.floor(Math.random() * 90000000) + 10000000}`,
      issue_date: '2020-01-15',
      expiry_date: '2030-01-15',
      issuing_authority: 'PNG Civil Registry Office',
      status: 'active',
      province: demoProvinces[provinceIndex],
      district: `${demoProvinces[provinceIndex]} District`,
      llg_ward: `Ward ${Math.floor(Math.random() * 20) + 1}`,
      eligibility_for_voting: Math.random() > 0.5,
      age: Math.floor(Math.random() * 60) + 18
    }

    return {
      found: true,
      citizen
    }
  }

  private generateDemoBirthDate(): string {
    const currentYear = new Date().getFullYear()
    const minAge = 18
    const maxAge = 80
    const birthYear = currentYear - minAge - Math.floor(Math.random() * (maxAge - minAge))
    const month = Math.floor(Math.random() * 12) + 1
    const day = Math.floor(Math.random() * 28) + 1

    return `${birthYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }
}

export const nidService = new NIDService()
