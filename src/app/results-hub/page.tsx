'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { enqueueResult, processQueue, getQueue, toUSSDPackets } from '@/lib/resultsHub'

export default function ResultsHubPage() {
  const [station, setStation] = useState('NCD-Station-001')
  const [province, setProvince] = useState('National Capital District')
  const [district, setDistrict] = useState('Moresby North-East')
  const [registered, setRegistered] = useState(1000)
  const [votes, setVotes] = useState(650)
  const [receipts, setReceipts] = useState<string[]>([])

  function handleEnqueue() {
    const item = enqueueResult({
      polling_station: station,
      province,
      district,
      total_registered_voters: registered,
      total_votes_cast: votes,
      candidate_results: { 'Candidate A': 300, 'Candidate B': 250, 'Candidate C': 100 },
      polling_officer_id: 'demo-officer-001'
    })
    alert(`Queued result for ${item.polling_station}`)
  }

  async function handleProcess() {
    const res = await processQueue()
    setReceipts(res.receipts)
  }

  const queue = getQueue()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Results Transmission Hub</h1>
        <p className="text-sm text-gray-600 mb-6">Store-and-forward multi-path transmission with SMS/USSD packetization and receipt proofs.</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Result Packet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Polling Station</label>
                <Input value={station} onChange={e => setStation(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Province</label>
                <Input value={province} onChange={e => setProvince(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">District</label>
                <Input value={district} onChange={e => setDistrict(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Registered Voters</label>
                <Input type="number" value={registered} onChange={e => setRegistered(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-sm">Votes Cast</label>
                <Input type="number" value={votes} onChange={e => setVotes(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEnqueue}>Enqueue Packet</Button>
              <Button onClick={handleProcess} variant="secondary">Process Queue</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <p className="text-sm text-gray-500">No queued packets.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Station</th>
                      <th className="px-2 py-1 text-left">Province</th>
                      <th className="px-2 py-1 text-left">District</th>
                      <th className="px-2 py-1 text-left">Queued</th>
                      <th className="px-2 py-1 text-left">Attempts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((q, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1">{q.polling_station}</td>
                        <td className="px-2 py-1">{q.province}</td>
                        <td className="px-2 py-1">{q.district}</td>
                        <td className="px-2 py-1">{new Date(q.queued_at).toLocaleString()}</td>
                        <td className="px-2 py-1">{q.attempts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receipts & SMS/USSD Packets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {receipts.length > 0 && (
              <div>
                <label className="text-sm font-medium">Receipt Proofs</label>
                <ul className="text-xs bg-gray-50 p-3 rounded-md">
                  {receipts.map((r, i) => (
                    <li key={i} className="break-all">{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Last Packet (SMS/USSD chunks)</label>
              <pre className="bg-gray-50 p-3 rounded-md text-xs">{JSON.stringify(toUSSDPackets({
                polling_station: station,
                province,
                district,
                total_registered_voters: registered,
                total_votes_cast: votes,
                candidate_results: { 'Candidate A': 300, 'Candidate B': 250, 'Candidate C': 100 },
                polling_officer_id: 'demo-officer-001'
              }), null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
