import { databaseService, type PollingResult } from './database'
import { computeReceiptHash } from './security'
import { createSupabaseClient } from './supabase'

const supabase = createSupabaseClient()

export interface QueueItem extends PollingResult {
  queued_at: string
  attempts: number
  last_error?: string
}

const STORAGE_KEY = 'results_queue_v1'

function loadQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as QueueItem[] : []
  } catch {
    return []
  }
}

function saveQueue(items: QueueItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function enqueueResult(result: PollingResult): QueueItem {
  const item: QueueItem = { ...result, queued_at: new Date().toISOString(), attempts: 0 }
  const q = loadQueue()
  q.push(item)
  saveQueue(q)
  return item
}

export async function processQueue(): Promise<{ processed: number; errors: number; receipts: string[] }> {
  const q = loadQueue()
  let processed = 0
  let errors = 0
  const receipts: string[] = []

  for (let i = 0; i < q.length; i++) {
    const item = q[i]
    try {
      const { success, data } = await databaseService.submitPollingResults(item)
      if (success) {
        const receipt = computeReceiptHash({ station: item.polling_station, time: new Date().toISOString() })
        receipts.push(receipt)

        // Persist transmission record
        await supabase
          .from('transmissions')
          .insert([{
            polling_result_id: data?.id,
            polling_station: item.polling_station,
            province: item.province,
            district: item.district,
            path: 'IP',
            status: 'acked',
            attempts: item.attempts + 1,
            payload_hash: computeReceiptHash(item as unknown as Record<string, unknown>),
            receipt
          }])

        q.splice(i, 1)
        i--
        processed++
      } else {
        item.attempts++
        errors++
      }
    } catch (err: any) {
      item.attempts++
      item.last_error = err?.message || 'Unknown error'
      errors++
    }
  }

  saveQueue(q)
  return { processed, errors, receipts }
}

export function getQueue(): QueueItem[] {
  return loadQueue()
}

// Simulate USSD/SMS chunking for low-bandwidth transmission
export function toUSSDPackets(result: PollingResult): string[] {
  const payload = {
    s: result.polling_station,
    p: result.province,
    d: result.district,
    r: result.total_registered_voters,
    v: result.total_votes_cast,
  }
  const text = JSON.stringify(payload)
  const size = 120 // characters per SMS/USSD segment
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}
