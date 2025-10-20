import { demoFaceRecognitionService, type FaceDescriptor } from './faceRecognitionDemo'

export interface PersonRecord {
  id: string
  full_name: string
  date_of_birth?: string
  province?: string
  district?: string
  nid_number?: string
  face_descriptor?: string
}

export interface DedupeCandidate {
  a: PersonRecord
  b: PersonRecord
  score: number // fused score 0..1
  reasons: string[]
}

function jaroWinkler(a: string, b: string): number {
  // Simple approximation using normalized edit distance
  if (!a || !b) return 0
  const s1 = a.toLowerCase().replace(/\s+/g, '')
  const s2 = b.toLowerCase().replace(/\s+/g, '')
  const len = Math.max(s1.length, s2.length)
  let mismatches = 0
  for (let i = 0; i < len; i++) {
    if (s1[i] !== s2[i]) mismatches++
  }
  return Math.max(0, 1 - mismatches / len)
}

function dobSimilarity(a?: string, b?: string): number {
  if (!a || !b) return 0
  return a === b ? 1 : 0
}

function provinceMatch(a?: string, b?: string): number {
  if (!a || !b) return 0
  return a === b ? 1 : 0.5
}

function faceSimilarity(a?: string, b?: string): number {
  if (!a || !b) return 0
  const da = demoFaceRecognitionService.base64ToDescriptor(a)
  const db = demoFaceRecognitionService.base64ToDescriptor(b)
  // Simple cosine-like similarity for demo
  const len = Math.min(da.length, db.length)
  if (len === 0) return 0
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < len; i++) {
    dot += da[i] * db[i]
    na += da[i] * da[i]
    nb += db[i] * db[i]
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1
  const cos = Math.max(0, dot / denom)
  return cos // 0..1
}

export function blockByProvince(records: PersonRecord[]): Map<string, PersonRecord[]> {
  const blocks = new Map<string, PersonRecord[]>()
  records.forEach(r => {
    const key = r.province || 'UNKNOWN'
    blocks.set(key, [...(blocks.get(key) || []), r])
  })
  return blocks
}

export function findDedupeCandidates(records: PersonRecord[], threshold = 0.8): DedupeCandidate[] {
  const blocks = blockByProvince(records)
  const candidates: DedupeCandidate[] = []

  for (const [, group] of blocks) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i]
        const b = group[j]
        const nameScore = jaroWinkler(a.full_name, b.full_name)
        const dobScore = dobSimilarity(a.date_of_birth, b.date_of_birth)
        const faceScore = faceSimilarity(a.face_descriptor, b.face_descriptor)
        const nidBoost = a.nid_number && b.nid_number && a.nid_number === b.nid_number ? 0.2 : 0

        const fused = 0.5 * nameScore + 0.3 * faceScore + 0.2 * dobScore + nidBoost
        if (fused >= threshold) {
          const reasons: string[] = []
          if (nameScore > 0.9) reasons.push('Strong name match')
          if (dobScore === 1) reasons.push('Exact date of birth')
          if (faceScore > 0.7) reasons.push('High facial similarity')
          if (nidBoost > 0) reasons.push('Same NID number')
          candidates.push({ a, b, score: Math.min(1, fused), reasons })
        }
      }
    }
  }

  return candidates.sort((x, y) => y.score - x.score)
}
