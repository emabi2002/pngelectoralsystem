'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Users, Vote, MapPin, TrendingUp, RefreshCw, Download } from 'lucide-react'

// Mock data for demonstration
const mockResults = {
  totalRegisteredVoters: 8564231,
  totalVotesCast: 4238901,
  turnoutPercentage: 49.5,
  transmittedStations: 18234,
  totalStations: 23874
}

const mockProvinceData = [
  { province: 'National Capital District', registered: 658432, votes: 412890, turnout: 62.7, transmitted: 894, total: 923 },
  { province: 'Western Highlands', registered: 524128, votes: 298764, turnout: 57.0, transmitted: 1243, total: 1456 },
  { province: 'Eastern Highlands', registered: 486235, votes: 251432, turnout: 51.7, transmitted: 1123, total: 1387 },
  { province: 'Morobe', registered: 445621, votes: 214893, turnout: 48.2, transmitted: 1034, total: 1298 },
  { province: 'Western', registered: 289456, votes: 142314, turnout: 49.2, transmitted: 678, total: 856 },
  { province: 'Southern Highlands', registered: 412789, votes: 203457, turnout: 49.3, transmitted: 987, total: 1234 }
]

const mockCandidateResults = [
  { name: 'Peter O\'Neill', party: 'PNC', votes: 1256789, percentage: 29.6 },
  { name: 'James Marape', party: 'PANGU', votes: 1098432, percentage: 25.9 },
  { name: 'Belden Namah', party: 'URP', votes: 876543, percentage: 20.7 },
  { name: 'Others', party: 'Various', votes: 1007137, percentage: 23.8 }
]

export default function DashboardPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>('all')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
        // In real implementation, this would fetch new data
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  const refreshData = () => {
    setLastUpdate(new Date())
    // In real implementation, this would fetch new data from Supabase
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Election Results Dashboard</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={refreshData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                Live Updates • Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={isAutoRefresh}
                  onChange={(e) => setIsAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span>Auto-refresh</span>
              </label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {mockProvinceData.map((province) => (
                    <SelectItem key={province.province} value={province.province}>
                      {province.province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Registered Voters</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockResults.totalRegisteredVoters.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Votes Cast</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockResults.totalVotesCast.toLocaleString()}
                  </p>
                </div>
                <Vote className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turnout</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockResults.turnoutPercentage}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stations Transmitted</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mockResults.transmittedStations.toLocaleString()}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transmission Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {Math.round((mockResults.transmittedStations / mockResults.totalStations) * 100)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Candidate Results */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Results</CardTitle>
              <CardDescription>Leading candidates and vote distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCandidateResults.map((candidate, index) => (
                  <div key={candidate.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-gold' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{candidate.votes.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Provincial Turnout */}
          <Card>
            <CardHeader>
              <CardTitle>Provincial Turnout</CardTitle>
              <CardDescription>Voter turnout by province</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockProvinceData.map((province) => (
                  <div key={province.province} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{province.province}</span>
                      <span className="text-gray-600">{province.turnout}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${province.turnout}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{province.votes.toLocaleString()} votes</span>
                      <span>{province.transmitted}/{province.total} stations</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transmission Status */}
        <Card>
          <CardHeader>
            <CardTitle>Transmission Status</CardTitle>
            <CardDescription>Real-time status of polling station data transmission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mockProvinceData.map((province) => (
                <div key={province.province} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">{province.province}</h4>
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${(province.transmitted / province.total) * 50.27} 50.27`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {Math.round((province.transmitted / province.total) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {province.transmitted}/{province.total}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
