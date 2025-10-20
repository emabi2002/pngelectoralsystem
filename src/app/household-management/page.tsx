'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Users,
  UserPlus,
  Edit,
  Trash2,
  Search,
  MapPin,
  Eye,
  Download
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { censusService } from '@/lib/censusService'
import { exportService } from '@/lib/exportService'
import type { HouseholdData, PopulationData } from '@/lib/censusInterfaces'

export default function HouseholdManagementPage() {
  const { t } = useTranslation()
  const [households, setHouseholds] = useState<HouseholdData[]>([])
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdData | null>(null)
  const [householdMembers, setHouseholdMembers] = useState<PopulationData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loadHouseholds = async (enumerationArea?: string) => {
    setIsLoading(true)
    try {
      const data = await censusService.getHouseholdsByEnumerationArea(enumerationArea || 'EA001')
      setHouseholds(data)
    } catch (error) {
      console.error('Error loading households:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadHouseholdMembers = async (householdId: string) => {
    try {
      const members = await censusService.getHouseholdMembers(householdId)
      setHouseholdMembers(members)
    } catch (error) {
      console.error('Error loading household members:', error)
    }
  }

  const handleSelectHousehold = (household: HouseholdData) => {
    setSelectedHousehold(household)
    if (household.id) {
      loadHouseholdMembers(household.id)
    }
  }

  const handleExportMembers = () => {
    if (householdMembers.length > 0) {
      exportService.exportPopulationDataToExcel(householdMembers)
    }
  }

  useEffect(() => {
    loadHouseholds()
  }, [])

  const filteredHouseholds = households.filter(h =>
    h.household_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.village_settlement.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getHouseholdHead = () => {
    return householdMembers.find(m => m.relationship_to_head === 'Head')
  }

  const getMembersByRelationship = () => {
    const relationships: Record<string, PopulationData[]> = {}
    householdMembers.forEach(member => {
      if (!relationships[member.relationship_to_head]) {
        relationships[member.relationship_to_head] = []
      }
      relationships[member.relationship_to_head].push(member)
    })
    return relationships
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Household Member Management
              </h1>
              <p className="text-gray-600 mt-1">
                View, edit, and manage household census data
              </p>
            </div>
            <Link href="/census">
              <Button variant="outline">
                Back to Census
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Household List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Households
              </CardTitle>
              <CardDescription>
                {households.length} households in area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search households..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredHouseholds.map((household) => (
                    <div
                      key={household.id}
                      onClick={() => handleSelectHousehold(household)}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                        selectedHousehold?.id === household.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{household.household_number}</p>
                          <p className="text-xs text-gray-600 mt-1">{household.village_settlement}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {household.total_members} members
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {household.dwelling_type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Household Details and Members */}
          <div className="lg:col-span-2 space-y-6">
            {selectedHousehold ? (
              <>
                {/* Household Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Home className="w-5 h-5 mr-2" />
                        Household Information
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Household Number</p>
                        <p className="font-medium">{selectedHousehold.household_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Province</p>
                        <p className="font-medium">{selectedHousehold.province}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">District</p>
                        <p className="font-medium">{selectedHousehold.district}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">LLG/Ward</p>
                        <p className="font-medium">{selectedHousehold.llg_ward}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Village/Settlement</p>
                        <p className="font-medium">{selectedHousehold.village_settlement}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dwelling Type</p>
                        <p className="font-medium">{selectedHousehold.dwelling_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Members</p>
                        <p className="font-medium">{selectedHousehold.total_members}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Water Source</p>
                        <p className="font-medium">{selectedHousehold.water_source}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Electricity</p>
                        <p className="font-medium">{selectedHousehold.electricity_source}</p>
                      </div>
                      {selectedHousehold.latitude && selectedHousehold.longitude && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            GPS Coordinates
                          </p>
                          <p className="font-medium text-sm">
                            {selectedHousehold.latitude.toFixed(6)}, {selectedHousehold.longitude.toFixed(6)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Household Members */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Household Members
                        </CardTitle>
                        <CardDescription>
                          {householdMembers.length} registered members
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleExportMembers} disabled={householdMembers.length === 0}>
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button size="sm">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Add Member
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {householdMembers.length > 0 ? (
                      <div className="space-y-4">
                        {/* Household Head */}
                        {getHouseholdHead() && (
                          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-blue-600">Household Head</Badge>
                                  <Badge variant="outline">{getHouseholdHead()?.age} years</Badge>
                                  <Badge variant="outline">{getHouseholdHead()?.gender}</Badge>
                                </div>
                                <p className="font-semibold text-lg">{getHouseholdHead()?.full_name}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {getHouseholdHead()?.occupation || getHouseholdHead()?.employment_status}
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Education:</span> {getHouseholdHead()?.highest_education}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Marital Status:</span> {getHouseholdHead()?.marital_status}
                                  </div>
                                </div>
                                {getHouseholdHead()?.has_disability && (
                                  <Badge variant="outline" className="mt-2 border-orange-500 text-orange-700">
                                    Has Disability
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Other Members */}
                        <div className="space-y-3">
                          {householdMembers
                            .filter(m => m.relationship_to_head !== 'Head')
                            .map((member) => (
                              <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-semibold">{member.full_name}</p>
                                      <Badge variant="secondary" className="text-xs">
                                        {member.relationship_to_head}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span>{member.age} years</span>
                                      <span>•</span>
                                      <span>{member.gender}</span>
                                      <span>•</span>
                                      <span>{member.marital_status}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                      {member.current_school_attendance && (
                                        <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                                          In School
                                        </Badge>
                                      )}
                                      {member.has_disability && (
                                        <Badge variant="outline" className="text-xs border-orange-500 text-orange-700">
                                          Has Disability
                                        </Badge>
                                      )}
                                      {member.employment_status.includes('Employed') && (
                                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">
                                          Employed
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Family Summary */}
                        <Card className="bg-gray-50">
                          <CardHeader>
                            <CardTitle className="text-base">Family Composition</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Total Members</p>
                                <p className="text-2xl font-bold">{householdMembers.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Children (0-17)</p>
                                <p className="text-2xl font-bold">
                                  {householdMembers.filter(m => m.age < 18).length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Adults (18-64)</p>
                                <p className="text-2xl font-bold">
                                  {householdMembers.filter(m => m.age >= 18 && m.age < 65).length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Elderly (65+)</p>
                                <p className="text-2xl font-bold">
                                  {householdMembers.filter(m => m.age >= 65).length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">With Disability</p>
                                <p className="text-2xl font-bold text-orange-600">
                                  {householdMembers.filter(m => m.has_disability).length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">In School</p>
                                <p className="text-2xl font-bold text-green-600">
                                  {householdMembers.filter(m => m.current_school_attendance).length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Employed</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {householdMembers.filter(m => m.employment_status.includes('Employed')).length}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No members registered for this household
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a household to view members and details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
