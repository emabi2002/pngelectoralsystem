import { createSupabaseClient } from './supabase'

const supabase = createSupabaseClient()

export interface FingerCapture {
  hand: 'Left' | 'Right'
  finger: 'Thumb' | 'Index' | 'Middle' | 'Ring' | 'Little'
  quality?: number
  missing?: boolean
  template: string // opaque base64 or compact ISO template string
}

export interface FaceCapture {
  image_url?: string
  quality?: number
  template: string
}

export interface IrisCapture {
  eye: 'Left' | 'Right'
  quality?: number
  template: string
}

export interface BiometricPacket {
  rid?: string
  nid_number?: string
  kit_id?: string
  liveness_pass?: boolean
  notes?: string
  fingerprints: FingerCapture[]
  face?: FaceCapture
  iris?: IrisCapture[]
}

export async function storeBiometricPacket(packet: BiometricPacket): Promise<{ success: boolean; captureId?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('store_biometric_packet', {
      payload: packet as unknown as Record<string, unknown>
    })
    if (error) {
      console.error('store_biometric_packet error', error)
      return { success: false, error: error.message }
    }
    return { success: true, captureId: data as string }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
