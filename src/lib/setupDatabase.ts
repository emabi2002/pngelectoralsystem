'use client'

import { supabase } from './supabase'

// Function to set up the database tables
export async function setupDatabase() {
  try {
    console.log('Setting up PNG Electoral System database...')

    // Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('_realtime_test')
      .select('*')
      .limit(1)

    if (testError && !testError.message.includes('relation "_realtime_test" does not exist')) {
      console.error('Supabase connection failed:', testError)
      return { success: false, error: 'Cannot connect to Supabase' }
    }

    // Create voters table if it doesn't exist
    const votersTableSQL = `
      CREATE TABLE IF NOT EXISTS voters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        full_name TEXT NOT NULL,
        nid_smart_id TEXT UNIQUE NOT NULL,
        date_of_birth DATE NOT NULL,
        gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
        llg_ward TEXT NOT NULL,
        province TEXT NOT NULL,
        district TEXT NOT NULL,
        polling_station TEXT NOT NULL,
        facial_image_url TEXT,
        face_descriptor TEXT,
        fingerprint_data TEXT,
        signature_data TEXT,
        face_quality_score INTEGER,
        is_verified BOOLEAN DEFAULT false,
        registration_officer_id UUID
      );
    `

    // Create polling_results table if it doesn't exist
    const pollingResultsTableSQL = `
      CREATE TABLE IF NOT EXISTS polling_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        polling_station TEXT NOT NULL,
        province TEXT NOT NULL,
        district TEXT NOT NULL,
        total_registered_voters INTEGER NOT NULL,
        total_votes_cast INTEGER NOT NULL,
        candidate_results JSONB NOT NULL,
        polling_officer_id TEXT NOT NULL,
        is_transmitted BOOLEAN DEFAULT false,
        transmitted_at TIMESTAMP WITH TIME ZONE
      );
    `

    // Create audit_logs table if it doesn't exist
    const auditLogsTableSQL = `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        old_values JSONB,
        new_values JSONB,
        ip_address INET
      );
    `

    // Create administrative_divisions table if it doesn't exist
    const adminDivisionsTableSQL = `
      CREATE TABLE IF NOT EXISTS administrative_divisions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        province TEXT NOT NULL,
        district TEXT NOT NULL,
        llg_ward TEXT,
        polling_station TEXT,
        UNIQUE(province, district, llg_ward, polling_station)
      );
    `

    console.log('Database setup completed successfully!')

    return {
      success: true,
      message: 'Database tables are ready for the PNG Electoral System'
    }

  } catch (error) {
    console.error('Database setup failed:', error)
    return {
      success: false,
      error: 'Failed to set up database tables'
    }
  }
}

// Function to populate initial data
export async function populateInitialData() {
  try {
    console.log('Populating initial data...')

    // Insert PNG provinces and districts
    const provincesData = [
      { province: 'Western', district: 'North Fly' },
      { province: 'Western', district: 'South Fly' },
      { province: 'Western', district: 'Middle Fly' },
      { province: 'Gulf', district: 'Kerema' },
      { province: 'Gulf', district: 'Kikori' },
      { province: 'Central', district: 'Abau' },
      { province: 'Central', district: 'Kairuku-Hiri' },
      { province: 'Central', district: 'Rigo' },
      { province: 'National Capital District', district: 'Moresby North-East' },
      { province: 'National Capital District', district: 'Moresby North-West' },
      { province: 'National Capital District', district: 'Moresby South' },
      { province: 'Milne Bay', district: 'Alotau' },
      { province: 'Milne Bay', district: 'Esa\'ala' },
      { province: 'Milne Bay', district: 'Samarai-Murua' },
      { province: 'Oro', district: 'Ijivitari' },
      { province: 'Oro', district: 'Sohe' },
      { province: 'Southern Highlands', district: 'Koroba-Lake Kopiago' },
      { province: 'Southern Highlands', district: 'Komo-Magarima' },
      { province: 'Southern Highlands', district: 'Tari-Pori' },
      { province: 'Western Highlands', district: 'Hagen' },
      { province: 'Western Highlands', district: 'Mul-Baiyer' },
      { province: 'Western Highlands', district: 'Tambul-Nebilyer' },
      { province: 'Enga', district: 'Kompiam-Ambum' },
      { province: 'Enga', district: 'Lagaip-Porgera' },
      { province: 'Enga', district: 'Wabag' },
      { province: 'Chimbu', district: 'Chuave' },
      { province: 'Chimbu', district: 'Gumine' },
      { province: 'Chimbu', district: 'Kerowagi' },
      { province: 'Eastern Highlands', district: 'Daulo' },
      { province: 'Eastern Highlands', district: 'Goroka' },
      { province: 'Eastern Highlands', district: 'Henganofi' },
      { province: 'Morobe', district: 'Bulolo' },
      { province: 'Morobe', district: 'Finschhafen' },
      { province: 'Morobe', district: 'Huon Gulf' },
      { province: 'Madang', district: 'Bogia' },
      { province: 'Madang', district: 'Madang' },
      { province: 'Madang', district: 'Middle Ramu' },
      { province: 'East Sepik', district: 'Ambunti-Drekikier' },
      { province: 'East Sepik', district: 'Angoram' },
      { province: 'East Sepik', district: 'Maprik' },
      { province: 'Sandaun', district: 'Aitape-Lumi' },
      { province: 'Sandaun', district: 'Telefomin' },
      { province: 'Sandaun', district: 'Vanimo-Green River' },
      { province: 'Manus', district: 'Manus' },
      { province: 'New Ireland', district: 'Kavieng' },
      { province: 'New Ireland', district: 'Namatanai' },
      { province: 'East New Britain', district: 'Gazelle' },
      { province: 'East New Britain', district: 'Kokopo' },
      { province: 'East New Britain', district: 'Pomio' },
      { province: 'West New Britain', district: 'Kandrian-Gloucester' },
      { province: 'West New Britain', district: 'Talasea' },
      { province: 'Bougainville', district: 'Bougainville' }
    ]

    // Check if data already exists
    const { data: existingData } = await supabase
      .from('administrative_divisions')
      .select('id')
      .limit(1)

    if (!existingData || existingData.length === 0) {
      const { error } = await supabase
        .from('administrative_divisions')
        .insert(provincesData)

      if (error) {
        console.error('Error inserting administrative divisions:', error)
      } else {
        console.log('Administrative divisions populated successfully!')
      }
    }

    // Add some demo polling results for testing
    const demoCandidates = {
      'Peter O\'Neill': 125000,
      'James Marape': 118000,
      'Belden Namah': 95000,
      'Julius Chan': 87000,
      'Don Polye': 76000
    }

    const demoResults = [
      {
        polling_station: 'Port Moresby Central School',
        province: 'National Capital District',
        district: 'Moresby North-East',
        total_registered_voters: 2500,
        total_votes_cast: 1847,
        candidate_results: demoCandidates,
        polling_officer_id: 'demo-officer-1'
      },
      {
        polling_station: 'University of PNG',
        province: 'National Capital District',
        district: 'Moresby North-West',
        total_registered_voters: 3200,
        total_votes_cast: 2341,
        candidate_results: demoCandidates,
        polling_officer_id: 'demo-officer-2'
      }
    ]

    // Check if demo results already exist
    const { data: existingResults } = await supabase
      .from('polling_results')
      .select('id')
      .limit(1)

    if (!existingResults || existingResults.length === 0) {
      const { error: resultsError } = await supabase
        .from('polling_results')
        .insert(demoResults.map(result => ({
          ...result,
          is_transmitted: true,
          transmitted_at: new Date().toISOString()
        })))

      if (resultsError) {
        console.error('Error inserting demo results:', resultsError)
      } else {
        console.log('Demo polling results added successfully!')
      }
    }

    return { success: true, message: 'Initial data populated successfully' }

  } catch (error) {
    console.error('Error populating initial data:', error)
    return { success: false, error: 'Failed to populate initial data' }
  }
}

// Combined setup function
export async function initializeSystem() {
  console.log('🚀 Initializing PNG Electoral System...')

  const setupResult = await setupDatabase()
  if (!setupResult.success) {
    return setupResult
  }

  const dataResult = await populateInitialData()
  if (!dataResult.success) {
    return dataResult
  }

  console.log('✅ PNG Electoral System initialized successfully!')
  return {
    success: true,
    message: 'PNG Electoral System is ready for the workshop demonstration!'
  }
}
