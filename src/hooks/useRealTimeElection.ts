'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { databaseService } from '@/lib/database'

export interface ElectionStats {
  totalRegisteredVoters: number
  totalVotesCast: number
  turnoutPercentage: number
  transmittedStations: number
  totalStations: number
}

export interface RecentEvent {
  id: string
  type: 'voter_registered' | 'results_transmitted' | 'station_updated'
  message: string
  timestamp: Date
  province?: string
}

export interface CandidateResult {
  name: string
  votes: number
  percentage: number
}

export interface ProvinceData {
  province: string
  votes: number
  stations: number
  registered: number
  turnout: number
}

const defaultStats: ElectionStats = {
  totalRegisteredVoters: 0,
  totalVotesCast: 0,
  turnoutPercentage: 0,
  transmittedStations: 0,
  totalStations: 0
}

export function useRealTimeElection() {
  const [stats, setStats] = useState<ElectionStats>(defaultStats)
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')
  const [candidates, setCandidates] = useState<CandidateResult[]>([])
  const [provinces, setProvinces] = useState<ProvinceData[]>([])

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      setConnectionStatus('connecting')

      // Load election statistics
      const statsData = await databaseService.getElectionStats()
      const voterStats = await databaseService.getVoterStats()

      // Transform the data to match our interface
      const transformedStats: ElectionStats = {
        totalRegisteredVoters: voterStats.totalRegistered,
        totalVotesCast: statsData.totalVotesCast,
        turnoutPercentage: voterStats.totalRegistered > 0
          ? (statsData.totalVotesCast / voterStats.totalRegistered) * 100
          : 0,
        transmittedStations: statsData.transmittedStations,
        totalStations: statsData.totalStations
      }

      setStats(transformedStats)

      // Set empty recent events for now (will be populated by real-time subscriptions)
      setRecentEvents([])

      // Transform candidate results
      const candidateData: CandidateResult[] = Object.entries(statsData.candidateResults).map(([name, votes]) => ({
        name,
        votes: votes as number,
        percentage: statsData.totalVotesCast > 0 ? ((votes as number) / statsData.totalVotesCast) * 100 : 0
      }))
      setCandidates(candidateData)

      // Transform province data
      const provinceData: ProvinceData[] = Object.entries(statsData.provinceResults).map(([province, data]) => ({
        province,
        votes: data.votes,
        stations: data.stations,
        registered: voterStats.byProvince[province] || 0,
        turnout: voterStats.byProvince[province] > 0
          ? (data.votes / voterStats.byProvince[province]) * 100
          : 0
      }))
      setProvinces(provinceData)

      setIsConnected(true)
      setConnectionStatus('connected')
    } catch (error) {
      console.error('Error loading initial data:', error)
      setIsConnected(false)
      setConnectionStatus('disconnected')

      // Use default demo data on error
      setStats({
        totalRegisteredVoters: 5420000,
        totalVotesCast: 3250000,
        turnoutPercentage: 59.9,
        transmittedStations: 8945,
        totalStations: 10250
      })

      setCandidates([
        { name: 'James Marape', votes: 1250000, percentage: 38.5 },
        { name: 'Peter O\'Neill', votes: 980000, percentage: 30.2 },
        { name: 'Belden Namah', votes: 650000, percentage: 20.0 },
        { name: 'Other Candidates', votes: 370000, percentage: 11.3 }
      ])

      setProvinces([
        { province: 'National Capital District', votes: 650000, stations: 450, registered: 650000, turnout: 72.5 },
        { province: 'Western', votes: 180000, stations: 180, registered: 180000, turnout: 68.2 },
        { province: 'Gulf', votes: 120000, stations: 90, registered: 120000, turnout: 65.8 }
      ])
    }
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    if (typeof window === 'undefined') return

    loadInitialData()

    // Subscribe to real-time updates
    const votersChannel = supabase
      .channel('voters_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'voters' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newEvent: RecentEvent = {
              id: payload.new.id as string,
              type: 'voter_registered' as const,
              message: `New voter registered in ${payload.new.province}`,
              timestamp: new Date(),
              province: payload.new.province as string
            }

            setRecentEvents(prev => [newEvent, ...prev].slice(0, 10))

            // Update stats
            setStats(prev => ({
              ...prev,
              totalRegisteredVoters: prev.totalRegisteredVoters + 1
            }))
          }
        }
      )
      .subscribe()

    const resultsChannel = supabase
      .channel('results_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'polling_results' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newEvent: RecentEvent = {
              id: payload.new.id as string,
              type: 'results_transmitted' as const,
              message: `Results transmitted from ${payload.new.polling_station}`,
              timestamp: new Date(),
              province: payload.new.province as string
            }

            setRecentEvents(prev => [newEvent, ...prev].slice(0, 10))

            // Refresh stats when results are updated
            loadInitialData()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(votersChannel)
      supabase.removeChannel(resultsChannel)
    }
  }, [loadInitialData])

  const refreshData = useCallback(() => {
    loadInitialData()
  }, [loadInitialData])

  const getTopCandidates = useCallback(() => {
    return candidates.sort((a, b) => b.votes - a.votes).slice(0, 5)
  }, [candidates])

  const getProvincesByTurnout = useCallback(() => {
    return provinces.sort((a, b) => b.turnout - a.turnout)
  }, [provinces])

  return {
    stats,
    recentEvents,
    isConnected,
    connectionStatus,
    refreshData,
    getTopCandidates,
    getProvincesByTurnout,
    candidates,
    provinces
  }
}
