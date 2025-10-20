export type CandidateId = string

export interface Ballot {
  stationId?: string
  preferences: CandidateId[] // ordered by preference: [first, second, third]
}

export interface LPVRoundSnapshot {
  round: number
  tallies: Record<CandidateId, number>
  exhausted: number
  eliminated?: CandidateId
  redistributed?: Record<CandidateId, number>
}

export interface LPVResult {
  rounds: LPVRoundSnapshot[]
  winner?: CandidateId
  finalTallies: Record<CandidateId, number>
}

function findTopPreference(ballot: Ballot, eliminated: Set<CandidateId>): CandidateId | null {
  for (const pref of ballot.preferences) {
    if (!eliminated.has(pref)) return pref
  }
  return null
}

export function runLPV(candidates: CandidateId[], ballots: Ballot[]): LPVResult {
  const eliminated = new Set<CandidateId>()
  const rounds: LPVRoundSnapshot[] = []

  let currentTallies = tally(candidates, ballots, eliminated)

  while (Object.keys(currentTallies.tallies).length - eliminated.size > 1) {
    const snapshot: LPVRoundSnapshot = {
      round: rounds.length + 1,
      tallies: { ...currentTallies.tallies },
      exhausted: currentTallies.exhausted
    }

    // Determine elimination (lowest tally, break ties alphabetically)
    const alive = candidates.filter(c => !eliminated.has(c))
    const lowest = alive.reduce((min: CandidateId | null, c) => {
      if (min === null) return c
      const cm = currentTallies.tallies[c] || 0
      const mm = currentTallies.tallies[min] || 0
      if (cm < mm) return c
      if (cm === mm && c.localeCompare(min) < 0) return c
      return min
    }, null)

    if (!lowest) break
    eliminated.add(lowest)
    snapshot.eliminated = lowest

    // Redistribute ballots that had lowest as top remaining pref
    const redistributed: Record<CandidateId, number> = {}
    ballots.forEach(ballot => {
      const top = findTopPreference(ballot, eliminated)
      if (top === lowest) {
        // move to next available preference
        const nextPref = ballot.preferences.find(p => !eliminated.has(p) && p !== lowest) || null
        if (nextPref) {
          redistributed[nextPref] = (redistributed[nextPref] || 0) + 1
        } else {
          snapshot.exhausted += 1
        }
      }
    })

    snapshot.redistributed = redistributed
    rounds.push(snapshot)

    // Re-tally for next round
    currentTallies = tally(candidates, ballots, eliminated)
  }

  const winner = candidates.filter(c => !eliminated.has(c)).sort((a, b) => {
    const ta = currentTallies.tallies[a] || 0
    const tb = currentTallies.tallies[b] || 0
    if (tb !== ta) return tb - ta
    return a.localeCompare(b)
  })[0]

  return {
    rounds,
    winner,
    finalTallies: { ...currentTallies.tallies }
  }
}

export function tally(candidates: CandidateId[], ballots: Ballot[], eliminated: Set<CandidateId>): { tallies: Record<CandidateId, number>; exhausted: number } {
  const tallies: Record<CandidateId, number> = {}
  let exhausted = 0

  ballots.forEach(ballot => {
    const pref = findTopPreference(ballot, eliminated)
    if (pref) {
      tallies[pref] = (tallies[pref] || 0) + 1
    } else {
      exhausted++
    }
  })

  // Ensure all alive candidates have entries
  candidates.forEach(c => {
    if (!eliminated.has(c)) {
      tallies[c] = tallies[c] || 0
    }
  })

  return { tallies, exhausted }
}
