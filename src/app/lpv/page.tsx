'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { runLPV, type Ballot } from '@/lib/lpvEngine'

const defaultCandidates = ['Candidate A', 'Candidate B', 'Candidate C']

export default function LPVPage() {
  const [candidates, setCandidates] = useState<string[]>(defaultCandidates)
  const [ballots, setBallots] = useState<Ballot[]>(generateSampleBallots())
  const [result, setResult] = useState<any>(null)

  function generateSampleBallots(): Ballot[] {
    // Simple synthetic distribution
    const samples: Ballot[] = []
    for (let i = 0; i < 100; i++) {
      const shuffled = [...defaultCandidates].sort(() => Math.random() - 0.5)
      samples.push({ preferences: shuffled.slice(0, 3) })
    }
    return samples
  }

  function handleRun() {
    const res = runLPV(candidates, ballots)
    setResult(res)
  }

  function addCandidate() {
    setCandidates(prev => [...prev, `Candidate ${String.fromCharCode(65 + prev.length)}`])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">LPV Counting Engine Demo</h1>
        <p className="text-sm text-gray-600 mb-6">PNG-specific Limited Preferential Voting (LPV) with elimination rounds, redistribution, and audit snapshots.</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Candidates</label>
              <div className="flex flex-wrap gap-2">
                {candidates.map((c, idx) => (
                  <Input key={idx} value={c} onChange={(e) => {
                    const next = [...candidates]
                    next[idx] = e.target.value
                    setCandidates(next)
                  }} className="w-48" />
                ))}
                <Button onClick={addCandidate} variant="secondary">Add Candidate</Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ballots</label>
              <p className="text-xs text-gray-500">Using 100 synthetic ballots with random preferences.</p>
              <Button onClick={() => setBallots(generateSampleBallots())} variant="outline">Regenerate Ballots</Button>
            </div>

            <Button onClick={handleRun}>Run LPV Count</Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm">Winner: <span className="font-semibold">{result.winner}</span></p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Round</th>
                      {candidates.map(c => (
                        <th key={c} className="px-2 py-1 text-left">{c}</th>
                      ))}
                      <th className="px-2 py-1 text-left">Exhausted</th>
                      <th className="px-2 py-1 text-left">Eliminated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rounds.map((r: any) => (
                      <tr key={r.round} className="border-t">
                        <td className="px-2 py-1">{r.round}</td>
                        {candidates.map(c => (
                          <td key={c} className="px-2 py-1">{r.tallies[c] ?? 0}</td>
                        ))}
                        <td className="px-2 py-1">{r.exhausted}</td>
                        <td className="px-2 py-1">{r.eliminated || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium">JSON Output</label>
                <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
