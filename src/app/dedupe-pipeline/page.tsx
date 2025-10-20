'use client'

import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { findDedupeCandidates, type PersonRecord } from '@/lib/dedupePipeline'

const sample: PersonRecord[] = [
  { id: '1', full_name: 'John Kila', date_of_birth: '1985-03-15', province: 'National Capital District', nid_number: 'PNG12345678' },
  { id: '2', full_name: 'Jon Killa', date_of_birth: '1985-03-15', province: 'National Capital District' },
  { id: '3', full_name: 'Mary Temu', date_of_birth: '1990-01-01', province: 'Morobe' },
  { id: '4', full_name: 'Peter Kaupa', date_of_birth: '1979-07-12', province: 'Eastern Highlands' }
]

export default function DedupePipelinePage() {
  const candidates = useMemo(() => findDedupeCandidates(sample, 0.75), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Deduplication & Roll-Cleaning</h1>
        <p className="text-sm text-gray-600 mb-6">Blocking + fused biometric/biographic scoring with adjudication candidates.</p>

        <Card>
          <CardHeader>
            <CardTitle>Potential Duplicates</CardTitle>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <p className="text-sm text-gray-500">No candidates found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Record A</th>
                      <th className="px-2 py-1 text-left">Record B</th>
                      <th className="px-2 py-1 text-left">Score</th>
                      <th className="px-2 py-1 text-left">Reasons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1">{c.a.full_name} ({c.a.nid_number || c.a.id})</td>
                        <td className="px-2 py-1">{c.b.full_name} ({c.b.nid_number || c.b.id})</td>
                        <td className="px-2 py-1">{(c.score * 100).toFixed(1)}%</td>
                        <td className="px-2 py-1">{c.reasons.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
