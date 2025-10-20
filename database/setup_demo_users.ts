import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// This requires the service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface DemoUser {
  email: string
  password: string
  profile: {
    full_name: string
    role: 'enumerator' | 'supervisor' | 'analyst' | 'administrator'
    province?: string
    district?: string
    enumeration_area?: string
    phone_number: string
  }
}

const demoUsers: DemoUser[] = [
  {
    email: 'enumerator@demo.pg',
    password: 'demo123',
    profile: {
      full_name: 'Demo Enumerator',
      role: 'enumerator',
      province: 'National Capital District',
      district: 'Moresby North-East',
      enumeration_area: 'EA-NCD-001',
      phone_number: '+675 72345601'
    }
  },
  {
    email: 'supervisor@demo.pg',
    password: 'demo123',
    profile: {
      full_name: 'Demo Supervisor',
      role: 'supervisor',
      province: 'National Capital District',
      district: 'Moresby North-East',
      phone_number: '+675 72345602'
    }
  },
  {
    email: 'analyst@demo.pg',
    password: 'demo123',
    profile: {
      full_name: 'Demo Analyst',
      role: 'analyst',
      phone_number: '+675 72345603'
    }
  },
  {
    email: 'admin@demo.pg',
    password: 'demo123',
    profile: {
      full_name: 'Demo Administrator',
      role: 'administrator',
      phone_number: '+675 72345604'
    }
  }
]

async function setupDemoUsers() {
  console.log('🚀 Setting up demo user accounts...\n')

  for (const user of demoUsers) {
    try {
      console.log(`Creating user: ${user.email} (${user.profile.role})`)

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.profile.full_name,
          role: user.profile.role
        }
      })

      if (authError) {
        // If user already exists, try to get existing user
        if (authError.message.includes('already registered')) {
          console.log(`  ⚠️  User already exists: ${user.email}`)
          continue
        }
        throw authError
      }

      if (!authData.user) {
        console.log(`  ❌ Failed to create user: ${user.email}`)
        continue
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          email: user.email,
          full_name: user.profile.full_name,
          role: user.profile.role,
          province: user.profile.province,
          district: user.profile.district,
          enumeration_area: user.profile.enumeration_area,
          phone_number: user.profile.phone_number,
          is_active: true
        }])

      if (profileError) {
        console.log(`  ⚠️  Profile creation error (user may already exist): ${profileError.message}`)
      } else {
        console.log(`  ✅ Successfully created: ${user.email}`)
      }

    } catch (error: any) {
      console.error(`  ❌ Error creating ${user.email}:`, error.message)
    }

    console.log('') // Empty line for readability
  }

  console.log('\n✨ Demo user setup complete!\n')
  console.log('Demo Accounts:')
  console.log('─────────────────────────────────────────────')
  demoUsers.forEach(user => {
    console.log(`${user.profile.role.padEnd(15)} | ${user.email.padEnd(25)} | ${user.password}`)
  })
  console.log('─────────────────────────────────────────────\n')
}

// Run the setup
setupDemoUsers()
  .then(() => {
    console.log('✅ Setup script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Setup script failed:', error)
    process.exit(1)
  })
