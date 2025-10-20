'use client'

import { supabase } from './supabase'

export type UserRole = 'enumerator' | 'supervisor' | 'analyst' | 'administrator'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  province?: string
  district?: string
  enumeration_area?: string
  phone_number?: string
  is_active: boolean
  created_at: string
  last_login?: string
}

class AuthService {
  async signUp(email: string, password: string, profile: Partial<UserProfile>) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profile.full_name,
            role: profile.role || 'enumerator',
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: authData.user.id,
              email,
              full_name: profile.full_name || '',
              role: (profile.role as UserRole) || 'enumerator',
              province: profile.province,
              district: profile.district,
              enumeration_area: profile.enumeration_area,
              phone_number: profile.phone_number,
              is_active: true,
            },
          ])

        if (profileError) throw profileError
      }

      return { success: true, user: authData.user }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)
      }

      return { success: true, user: data.user, session: data.session }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as UserProfile
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  }

  async hasRole(userId: string, allowedRoles: UserRole[]): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId)
      if (!profile) return false
      return allowedRoles.includes(profile.role)
    } catch (error) {
      console.error('Check role error:', error)
      return false
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
      })

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Reset password error:', error)
      return { success: false, error: error.message }
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Update password error:', error)
      return { success: false, error: error.message }
    }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as UserProfile[]
    } catch (error) {
      console.error('Get all users error:', error)
      return []
    }
  }

  async deactivateUser(userId: string) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', userId)

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Deactivate user error:', error)
      return { success: false, error: error.message }
    }
  }

  async activateUser(userId: string) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: true })
        .eq('id', userId)

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Activate user error:', error)
      return { success: false, error: error.message }
    }
  }

  // Post-login: allow access to all routes
  canAccessRoute(_userRole: UserRole, _route: string): boolean {
    return true
  }
}

export const authService = new AuthService()
export default authService
