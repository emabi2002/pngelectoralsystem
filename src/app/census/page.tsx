'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Users,
  BarChart3,
  MapPin,
  FileText,
  CheckCircle,
  UserPlus,
  Accessibility,
  TrendingUp
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CensusPage() {
  const { t } = useTranslation()
  const [censusMode, setCensusMode] = useState<'household' | 'individual' | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Population & Housing Census 2025
              </h1>
              <p className="text-gray-600 mt-1">
                Papua New Guinea National Census System
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                {t('common.back_to_dashboard')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Banner */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              Digital Census 2025
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Comprehensive Population & Housing Census
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              A complete census registration system for all citizens of Papua New Guinea,
              covering all ages from birth to elderly, with disability-inclusive data collection
              following international standards (UN, WHO, Washington Group).
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>All Ages Registration</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Disability Inclusive</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Biometric Capable</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>NID Integration Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Dashboard Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/census-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-semibold">Data Visualization</p>
                <p className="text-xs text-gray-600 mt-1">Interactive charts & stats</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/household-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <Home className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-semibold">Manage Households</p>
                <p className="text-xs text-gray-600 mt-1">View & edit members</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/census-monitoring">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <p className="font-semibold">Progress Monitor</p>
                <p className="text-xs text-gray-600 mt-1">Supervisor dashboard</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/enumerator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <Users className="w-8 h-8 text-orange-600 mb-2" />
                <p className="font-semibold">Enumerator App</p>
                <p className="text-xs text-gray-600 mt-1">Mobile field interface</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Census Registration Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Household Registration */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-blue-700">
                <Home className="w-8 h-8 mr-3" />
                Household Registration
              </CardTitle>
              <CardDescription className="text-base">
                Register household dwelling and infrastructure information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900">Includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Location & GPS coordinates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Dwelling type and construction materials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Access to water, sanitation, electricity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Household assets and amenities</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => setCensusMode('household')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Household Registration
              </Button>
            </CardContent>
          </Card>

          {/* Individual/Population Registration */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-green-400">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-green-700">
                <Users className="w-8 h-8 mr-3" />
                Population Registration
              </CardTitle>
              <CardDescription className="text-base">
                Register all household members (all ages, disability-inclusive)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900">Includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Demographic data (all ages: birth to elderly)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Washington Group disability questions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Education, employment, migration data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span>Biometric capture (photo, fingerprints)</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => setCensusMode('individual')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Population Registration
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Accessibility className="w-5 h-5 mr-2 text-purple-600" />
                Disability Inclusive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Following Washington Group Short Set questions to identify persons with
                disabilities in seeing, hearing, walking, remembering, self-care, and communication.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                All Ages Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Register all household members from newborns to elderly citizens,
                building a complete demographic profile of Papua New Guinea.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                Geographic Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                GPS coordinates for every household, enabling precise enumeration area
                management and spatial analysis of census data.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-700" />
              Census Data Collection Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">International Standards:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• UN Principles and Recommendations for Population and Housing Censuses</li>
                  <li>• Washington Group on Disability Statistics (WG-SS)</li>
                  <li>• WHO International Classification of Functioning</li>
                  <li>• PNG National Statistics Office Guidelines</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Collected:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Demographics: Age, gender, marital status, ethnicity, religion</li>
                  <li>• Education: Literacy, school attendance, highest level</li>
                  <li>• Employment: Status, occupation, industry sector</li>
                  <li>• Health: Disability status, chronic illness, health insurance</li>
                  <li>• Housing: Dwelling type, amenities, infrastructure</li>
                  <li>• Migration: Residential history and status</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        {censusMode && (
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Census Form Loading...
            </h3>
            <p className="text-yellow-700 mb-4">
              {censusMode === 'household'
                ? 'Household registration form will be displayed here.'
                : 'Population registration form will be displayed here.'}
            </p>
            <Button
              onClick={() => setCensusMode(null)}
              variant="outline"
              className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
            >
              Back to Options
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
