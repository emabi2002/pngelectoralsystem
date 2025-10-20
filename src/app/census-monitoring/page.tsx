'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Home,
  TrendingUp,
  RefreshCw,
  MapPin,
  Shield
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280']

interface EnumerationProgress {
  area_code: string
  area_name: string
  estimated_households: number
  registered_households: number
  estimated_population: number
  registered_population: number
  completion_percentage: number
  status: 'not_started' | 'in_progress' | 'completed' | 'verified'
  enumerator_name: string
  data_quality_score: number
  start_date?: string
  last_update?: string
}

export default function CensusMonitoringPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  // Demo data for monitoring
  const [enumerationAreas] = useState<EnumerationProgress[]>([
    {
      area_code: 'EA001',
      area_name: 'Port Moresby Central',
      estimated_households: 250,
      registered_households: 245,
      estimated_population: 1250,
      registered_population: 1205,
      completion_percentage: 98,
      status: 'completed',
      enumerator_name: 'John Kila',
      data_quality_score: 95,
      start_date: '2025-01-10',
      last_update: '2025-01-15'
    },
    {
      area_code: 'EA002',
      area_name: 'Hohola North',
      estimated_households: 180,
      registered_households: 145,
      estimated_population: 900,
      registered_population: 725,
      completion_percentage: 81,
      status: 'in_progress',
      enumerator_name: 'Mary Tau',
      data_quality_score: 88,
      start_date: '2025-01-11',
      last_update: '2025-01-15'
    },
    {
      area_code: 'EA003',
      area_name: 'Gerehu Stage 1',
      estimated_households: 200,
      registered_households: 85,
      estimated_population: 1000,
      registered_population: 425,
      completion_percentage: 43,
      status: 'in_progress',
      enumerator_name: 'Peter Wari',
      data_quality_score: 72,
      start_date: '2025-01-12',
      last_update: '2025-01-14'
    },
    {
      area_code: 'EA004',
      area_name: 'Waigani',
      estimated_households: 150,
      registered_households: 0,
      estimated_population: 750,
      registered_population: 0,
      completion_percentage: 0,
      status: 'not_started',
      enumerator_name: 'Sarah Bani',
      data_quality_score: 0,
      start_date: undefined,
      last_update: undefined
    }
  ])

  const overallStats = {
    totalAreas: enumerationAreas.length,
    completedAreas: enumerationAreas.filter(ea => ea.status === 'completed').length,
    inProgressAreas: enumerationAreas.filter(ea => ea.status === 'in_progress').length,
    notStartedAreas: enumerationAreas.filter(ea => ea.status === 'not_started').length,
    totalHouseholdsTargeted: enumerationAreas.reduce((sum, ea) => sum + ea.estimated_households, 0),
    totalHouseholdsRegistered: enumerationAreas.reduce((sum, ea) => sum + ea.registered_households, 0),
    totalPopulationTargeted: enumerationAreas.reduce((sum, ea) => sum + ea.estimated_population, 0),
    totalPopulationRegistered: enumerationAreas.reduce((sum, ea) => sum + ea.registered_population, 0),
    averageDataQuality: enumerationAreas.reduce((sum, ea) => sum + ea.data_quality_score, 0) / enumerationAreas.length
  }

  const statusData = [
    { name: 'Completed', value: overallStats.completedAreas, color: '#10b981' },
    { name: 'In Progress', value: overallStats.inProgressAreas, color: '#f59e0b' },
    { name: 'Not Started', value: overallStats.notStartedAreas, color: '#ef4444' }
  ]

  const progressByArea = enumerationAreas.map(ea => ({
    area: ea.area_code,
    completion: ea.completion_percentage,
    quality: ea.data_quality_score
  }))

  const dailyProgress = [
    { date: 'Jan 10', households: 85, population: 425 },
    { date: 'Jan 11', households: 165, population: 825 },
    { date: 'Jan 12', households: 245, population: 1225 },
    { date: 'Jan 13', households: 325, population: 1625 },
    { date: 'Jan 14', households: 390, population: 1950 },
    { date: 'Jan 15', households: 475, population: 2355 }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-orange-500">In Progress</Badge>
      case 'not_started':
        return <Badge variant="destructive">Not Started</Badge>
      case 'verified':
        return <Badge className="bg-blue-600">Verified</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getQualityBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-600">Excellent</Badge>
    if (score >= 75) return <Badge className="bg-blue-600">Good</Badge>
    if (score >= 60) return <Badge className="bg-orange-500">Fair</Badge>
    return <Badge variant="destructive">Poor</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Census Progress Monitoring
              </h1>
              <p className="text-gray-600 mt-1">
                Supervisor dashboard - Track enumeration and data quality
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsLoading(true)}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/census">
                <Button variant="outline">
                  Back to Census
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-purple-600">
                  {((overallStats.totalHouseholdsRegistered / overallStats.totalHouseholdsTargeted) * 100).toFixed(1)}%
                </p>
                <Progress
                  value={(overallStats.totalHouseholdsRegistered / overallStats.totalHouseholdsTargeted) * 100}
                  className="h-2"
                />
                <p className="text-sm text-gray-600">
                  {overallStats.totalHouseholdsRegistered} / {overallStats.totalHouseholdsTargeted} households
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Enumeration Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-600">{overallStats.totalAreas}</p>
                <div className="flex gap-2 text-sm">
                  <Badge className="bg-green-600">{overallStats.completedAreas} Done</Badge>
                  <Badge className="bg-orange-500">{overallStats.inProgressAreas} Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Population Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-green-600">
                  {overallStats.totalPopulationRegistered.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Target: {overallStats.totalPopulationTargeted.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Data Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-indigo-600">
                  {overallStats.averageDataQuality.toFixed(1)}%
                </p>
                {getQualityBadge(overallStats.averageDataQuality)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Enumeration Area Status</CardTitle>
              <CardDescription>Distribution by completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Progress by Area */}
          <Card>
            <CardHeader>
              <CardTitle>Progress by Enumeration Area</CardTitle>
              <CardDescription>Completion and quality scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={progressByArea}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completion" fill="#3b82f6" name="Completion %" />
                  <Bar dataKey="quality" fill="#10b981" name="Quality Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily Registration Progress</CardTitle>
              <CardDescription>Cumulative households and population registered</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="households" stroke="#3b82f6" name="Households" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="population" stroke="#10b981" name="Population" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Area Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Enumeration Area Details
            </CardTitle>
            <CardDescription>
              Monitor individual area progress and quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enumerationAreas.map((area) => (
                <div key={area.area_code} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{area.area_code}</h3>
                        {getStatusBadge(area.status)}
                        {getQualityBadge(area.data_quality_score)}
                      </div>
                      <p className="text-sm text-gray-600">{area.area_name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Enumerator: <span className="font-medium">{area.enumerator_name}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">{area.completion_percentage}%</p>
                      <p className="text-xs text-gray-500">Complete</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Households</p>
                      <p className="font-semibold">
                        {area.registered_households} / {area.estimated_households}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Population</p>
                      <p className="font-semibold">
                        {area.registered_population} / {area.estimated_population}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Data Quality</p>
                      <p className="font-semibold">{area.data_quality_score}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Update</p>
                      <p className="font-semibold text-sm">
                        {area.last_update || 'Not started'}
                      </p>
                    </div>
                  </div>

                  <Progress value={area.completion_percentage} className="h-2" />

                  {/* Alerts */}
                  {area.completion_percentage < 50 && area.status === 'in_progress' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Behind schedule - requires attention</span>
                    </div>
                  )}
                  {area.data_quality_score < 75 && area.data_quality_score > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                      <Shield className="w-4 h-4" />
                      <span>Low data quality - needs review</span>
                    </div>
                  )}
                  {area.status === 'completed' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Ready for verification</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
