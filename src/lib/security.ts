import CryptoJS from 'crypto-js'

export interface EvidencePayload {
  subject: string
  action: string
  timestamp: string
  meta?: Record<string, unknown>
}

// Generates a deterministic evidence token for compliance logs (simulation)
// In production, use device hardware keys and rotate secrets
export function generateEvidenceToken(payload: EvidencePayload, confidence: number): string {
  const key = 'PNGEC_EVIDENCE_KEY' // demo key; replace with secure secret in production
  const canonical = JSON.stringify({ ...payload, confidence })
  const hmac = CryptoJS.HmacSHA256(canonical, key)
  return hmac.toString(CryptoJS.enc.Hex)
}

export function sha256(data: string): string {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex)
}

// Simple hash-chain for WORM-style audit trails
export function nextEventHash(previousHash: string, event: Record<string, unknown>): string {
  const combined = `${previousHash}|${JSON.stringify(event)}`
  return sha256(combined)
}

// Receipt proof for transmissions
export function computeReceiptHash(data: Record<string, unknown>): string {
  return sha256(JSON.stringify(data))
}

export default {
  generateEvidenceToken,
  nextEventHash,
  computeReceiptHash,
  sha256
}
