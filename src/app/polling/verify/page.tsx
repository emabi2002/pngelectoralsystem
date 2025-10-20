'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSupabaseClient } from '@/lib/supabase'

const supabase = createSupabaseClient()

export default function PollingVerificationPage() {
  const [nid, setNid] = useState('')
  const [station, setStation] = useState('NCD-Station-001')
  const [device, setDevice] = useState('DEVICE-DEMO-001')
  const [modality, setModality] = useState<'Fingerprint' | 'Face' | 'Iris'>('Fingerprint')
  const [sample, setSample] = useState('')
  const [result, setResult] = useState<{ match?: boolean; score?: number; capture_id?: string; error?: string }>({})

  async function handleVerify() {
    setResult({})
    const { data, error } = await supabase.rpc('verify_biometric', {
      in_modality: modality,
      in_sample: sample,
      in_nid: nid,
      in_station: station,
      in_device: device
    })
    if (error) {
      setResult({ error: error.message })
    } else if (Array.isArray(data) && data.length > 0) {
      const row = data[0] as any
      setResult({ match: row.match, score: row.score, capture_id: row.capture_id })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Polling Station 1:1 Verification</h1>
        <p className="text-sm text-gray-600 mb-6">Verify by Fingerprint, Face or Iris. Decision is logged with timing and device/station metadata.</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Verification Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">NID Number</label>
                <Input value={nid} onChange={e => setNid(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Station ID</label>
                <Input value={station} onChange={e => setStation(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Device ID</label>
                <Input value={device} onChange={e => setDevice(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Modality</label>
                <div className="flex gap-2">
                  {(['Fingerprint','Face','Iris'] as const).map(m => (
                    <Button key={m} variant={modality === m ? 'default' : 'outline'} onClick={() => setModality(m)}>{m}</Button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm">Sample Template (opaque)</label>
              <Input value={sample} onChange={e => setSample(e.target.value)} placeholder="Paste captured template string" />
            </div>
            <Button onClick={handleVerify}>Verify</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <p className="text-sm text-red-600">Error: {result.error}</p>
            ) : (
              <div className="text-sm">
                <p>Match: <span className="font-semibold">{String(result.match ?? false)}</span></p>
                <p>Score: <span className="font-semibold">{typeof result.score === 'number' ? result.score.toFixed(3) : '-'}</span></p>
                <p>Capture ID: <span className="font-mono break-all">{result.capture_id || '-'}</span></p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
