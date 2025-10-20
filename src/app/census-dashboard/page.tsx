'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  Users,
  Home,
  Accessibility,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { censusService } from '@/lib/censusService'
import { exportService } from '@/lib/exportService'
import type { CensusStatistics } from '@/lib/censusInterfaces'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function CensusDashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<CensusStatistics | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCensusData()
  }, [selectedProvince])

  const loadCensusData = async () => {
    setIsLoading(true)
    try {
      const province = selectedProvince === 'all' ? undefined : selectedProvince
      const data = await censusService.getCensusStatistics(province)
      setStats(data)
    } catch (error) {
      console.error('Error loading census data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Prepare chart data
  const ageGroupData = stats ? Object.entries(stats.populationByAgeGroup).map(([age, count]) => ({
    ageGroup: age,
    population: count,
    percentage: ((count / stats.totalPopulation) * 100).toFixed(1)
  })) : []

  const disabilityData = stats ? Object.entries(stats.disabilityByType).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    percentage: ((count / stats.totalPopulation) * 100).toFixed(2)
  })) : []

  const genderData = stats ? [
    { name: 'Male', value: stats.malePopulation },
    { name: 'Female', value: stats.femalePopulation }
  ] : []

  const dwellingData = stats ? Object.entries(stats.householdsByDwellingType).map(([type, count]) => ({
    name: type,
    households: count
  })) : []

  const servicesData = stats ? [
    { service: 'Electricity', households: stats.accessToBasicServices.electricity },
    { service: 'Clean Water', households: stats.accessToBasicServices.cleanWater },
    { service: 'Toilet', households: stats.accessToBasicServices.toilet }
  ] : []

  const keyIndicators = stats ? [
    { label: 'Literacy Rate', value: `${stats.literacyRate.toFixed(1)}%`, icon: GraduationCap, color: 'text-blue-600' },
    { label: 'School Attendance', value: `${stats.schoolAttendanceRate.toFixed(1)}%`, icon: GraduationCap, color: 'text-green-600' },
    { label: 'Employment Rate', value: `${stats.employmentRate.toFixed(1)}%`, icon: Briefcase, color: 'text-purple-600' },
    { label: 'Disability Prevalence', value: `${((stats.populationWithDisability / stats.totalPopulation) * 100).toFixed(1)}%`, icon: Accessibility, color: 'text-orange-600' }
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Census Data Visualization Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Interactive analytics and statistics
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => stats && exportService.exportStatisticsToPDF(stats, selectedProvince === 'all' ? undefined : selectedProvince)}
                disabled={!stats}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => stats && exportService.exportStatisticsToExcel(stats, selectedProvince === 'all' ? undefined : selectedProvince)}
                disabled={!stats}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={loadCensusData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
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
        {/* Filter Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by Province:</label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  <SelectItem value="National Capital District">National Capital District</SelectItem>
                  <SelectItem value="Western">Western</SelectItem>
                  <SelectItem value="Central">Central</SelectItem>
                  {/* Add more provinces as needed */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Loading census data...</p>
          </div>
        ) : stats ? (
          <>
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Population</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">{stats.totalPopulation.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">citizens</p>
                    </div>
                    <Users className="w-12 h-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Households</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{stats.totalHouseholds.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">households</p>
                    </div>
                    <Home className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Average Household Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-purple-600">{stats.averageHouseholdSize.toFixed(1)}</p>
                      <p className="text-sm text-gray-500 mt-1">persons/household</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Persons with Disability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-orange-600">{stats.populationWithDisability.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">{((stats.populationWithDisability / stats.totalPopulation) * 100).toFixed(1)}% of population</p>
                    </div>
                    <Accessibility className="w-12 h-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {keyIndicators.map((indicator, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <indicator.icon className={`w-8 h-8 ${indicator.color}`} />
                      <div>
                        <p className="text-sm text-gray-600">{indicator.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{indicator.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Age Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Population by Age Group</CardTitle>
                  <CardDescription>Distribution across age categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="population" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gender Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Population by Gender</CardTitle>
                  <CardDescription>Male vs Female distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name}: ${(((percent as number) || 0) * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Disability Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Disability by Functional Domain</CardTitle>
                  <CardDescription>Washington Group Short Set results</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={disabilityData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar name="Population" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Dwelling Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Households by Dwelling Type</CardTitle>
                  <CardDescription>Housing characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dwellingData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="households" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Basic Services Access */}
              <Card>
                <CardHeader>
                  <CardTitle>Access to Basic Services</CardTitle>
                  <CardDescription>Households with access to infrastructure</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={servicesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="households" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Detailed Disability Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Disability Statistics Details</CardTitle>
                  <CardDescription>Breakdown by functional limitation type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {disabilityData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{item.value.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No census data available</p>
          </div>
        )}
      </div>
    </div>
  )
}
