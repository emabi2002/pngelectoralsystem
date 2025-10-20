'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { storeBiometricPacket, type BiometricPacket, type FingerCapture } from '@/lib/biometricsClient'

const fingers: Array<{ hand: 'Left' | 'Right'; finger: 'Thumb' | 'Index' | 'Middle' | 'Ring' | 'Little' }> = [
  { hand: 'Left', finger: 'Thumb' },
  { hand: 'Left', finger: 'Index' },
  { hand: 'Left', finger: 'Middle' },
  { hand: 'Left', finger: 'Ring' },
  { hand: 'Left', finger: 'Little' },
  { hand: 'Right', finger: 'Thumb' },
  { hand: 'Right', finger: 'Index' },
  { hand: 'Right', finger: 'Middle' },
  { hand: 'Right', finger: 'Ring' },
  { hand: 'Right', finger: 'Little' },
]

export default function BiometricsCapturePage() {
  const [nid, setNid] = useState('')
  const [rid, setRid] = useState('')
  const [kitId, setKitId] = useState('KIT-DEMO-001')
  const [liveness, setLiveness] = useState(false)
  const [fingerTemplates, setFingerTemplates] = useState<Record<string, string>>({})
  const [faceTemplate, setFaceTemplate] = useState<string>('')
  const [irisLeft, setIrisLeft] = useState<string>('')
  const [irisRight, setIrisRight] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  function makePacket(): BiometricPacket {
    const fps: FingerCapture[] = fingers.map(f => ({
      hand: f.hand,
      finger: f.finger,
      template: fingerTemplates[`${f.hand}-${f.finger}`] || ''
    }))
    const iris = [] as any[]
    if (irisLeft) iris.push({ eye: 'Left', template: irisLeft })
    if (irisRight) iris.push({ eye: 'Right', template: irisRight })
    return {
      nid_number: nid || undefined,
      rid: rid || undefined,
      kit_id: kitId,
      liveness_pass: liveness,
      fingerprints: fps,
      face: faceTemplate ? { template: faceTemplate } : undefined,
      iris
    }
  }

  async function handleSubmit() {
    setStatus('Submitting...')
    const res = await storeBiometricPacket(makePacket())
    if (res.success) {
      setStatus(`Stored capture ${res.captureId}`)
    } else {
      setStatus(`Error: ${res.error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Enumerator Biometrics Capture</h1>
        <p className="text-sm text-gray-600 mb-6">Ten-print + face + iris/retina capture with liveness and secure storage.</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">NID Number (optional)</label>
                <Input value={nid} onChange={e => setNid(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">RID (if NID absent)</label>
                <Input value={rid} onChange={e => setRid(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Kit ID</label>
                <Input value={kitId} onChange={e => setKitId(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Liveness</label>
                <div className="flex gap-2">
                  <Button variant={liveness ? 'default' : 'outline'} onClick={() => setLiveness(true)}>Pass</Button>
                  <Button variant={!liveness ? 'default' : 'outline'} onClick={() => setLiveness(false)}>Fail</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fingerprints (Ten-print)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {fingers.map((f, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-xs font-medium">{f.hand} {f.finger}</label>
                  <Input placeholder="template (base64)" value={fingerTemplates[`${f.hand}-${f.finger}`] || ''} onChange={e => setFingerTemplates(prev => ({ ...prev, [`${f.hand}-${f.finger}`]: e.target.value }))} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Face</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <label className="text-sm">Face Template (opaque)</label>
            <Input placeholder="template (base64)" value={faceTemplate} onChange={e => setFaceTemplate(e.target.value)} />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Iris / Retina</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Left Eye</label>
              <Input placeholder="template (base64)" value={irisLeft} onChange={e => setIrisLeft(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Right Eye</label>
              <Input placeholder="template (base64)" value={irisRight} onChange={e => setIrisRight(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Submit Secure Packet</Button>
          <span className="text-sm text-gray-600">{status}</span>
        </div>
      </div>
    </div>
  )
}
