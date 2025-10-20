'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Home, MapPin, Users, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { HouseholdData } from '@/lib/censusInterfaces'
import { WATER_SOURCES, TOILET_FACILITIES, COOKING_FUELS } from '@/lib/censusInterfaces'

interface HouseholdFormProps {
  onSubmit: (data: Omit<HouseholdData, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel?: () => void
  isLoading?: boolean
  enumerationArea: string
  enumeratorId: string
}

const PNG_PROVINCES = [
  'National Capital District',
  'Western',
  'Gulf',
  'Central',
  'Milne Bay',
  'Oro (Northern)',
  'Southern Highlands',
  'Western Highlands',
  'Enga',
  'Simbu (Chimbu)',
  'Eastern Highlands',
  'Morobe',
  'Madang',
  'East Sepik',
  'West Sepik (Sandaun)',
  'Manus',
  'New Ireland',
  'East New Britain',
  'West New Britain',
  'Bougainville',
  'Hela',
  'Jiwaka'
]

const DWELLING_TYPES = ['Traditional', 'Modern', 'Semi-permanent', 'Temporary', 'Other'] as const

const WALL_MATERIALS = ['Timber', 'Concrete/Brick', 'Bamboo', 'Iron sheets', 'Grass/Leaves', 'Other']
const ROOF_MATERIALS = ['Iron sheets', 'Grass/Leaves', 'Tiles', 'Concrete', 'Other']
const FLOOR_MATERIALS = ['Concrete', 'Timber', 'Earth/Mud', 'Other']
const ELECTRICITY_SOURCES = ['Grid electricity', 'Generator', 'Solar', 'No electricity', 'Other']

export function HouseholdRegistrationForm({
  onSubmit,
  onCancel,
  isLoading = false,
  enumerationArea,
  enumeratorId
}: HouseholdFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Omit<HouseholdData, 'id' | 'created_at' | 'updated_at'>>({
    household_number: '',
    enumeration_area: enumerationArea,
    province: '',
    district: '',
    llg_ward: '',
    village_settlement: '',
    dwelling_type: 'Modern',
    wall_material: '',
    roof_material: '',
    floor_material: '',
    number_of_rooms: 1,
    water_source: '',
    toilet_facility: '',
    electricity_source: '',
    cooking_fuel: '',
    owns_dwelling: true,
    total_members: 0,
    latitude: undefined,
    longitude: undefined,
    enumerator_id: enumeratorId,
    enumeration_date: new Date().toISOString().split('T')[0],
    verification_status: 'pending',
    data_quality_score: 100
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [useGPS, setUseGPS] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const captureGPSLocation = () => {
    setUseGPS(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }))
          setUseGPS(false)
        },
        (error) => {
          console.error('GPS error:', error)
          alert('Unable to get GPS location. Please ensure location services are enabled.')
          setUseGPS(false)
        }
      )
    } else {
      alert('GPS not available on this device')
      setUseGPS(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.household_number) newErrors.household_number = 'Household number is required'
    if (!formData.province) newErrors.province = 'Province is required'
    if (!formData.district) newErrors.district = 'District is required'
    if (!formData.llg_ward) newErrors.llg_ward = 'LLG/Ward is required'
    if (!formData.village_settlement) newErrors.village_settlement = 'Village/Settlement is required'
    if (!formData.wall_material) newErrors.wall_material = 'Wall material is required'
    if (!formData.roof_material) newErrors.roof_material = 'Roof material is required'
    if (!formData.floor_material) newErrors.floor_material = 'Floor material is required'
    if (!formData.water_source) newErrors.water_source = 'Water source is required'
    if (!formData.toilet_facility) newErrors.toilet_facility = 'Toilet facility is required'
    if (!formData.electricity_source) newErrors.electricity_source = 'Electricity source is required'
    if (!formData.cooking_fuel) newErrors.cooking_fuel = 'Cooking fuel is required'
    if (formData.number_of_rooms < 1) newErrors.number_of_rooms = 'Must have at least 1 room'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Home className="w-4 h-4 mr-2" />
          Household Census Registration
        </Badge>
      </div>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Information
          </CardTitle>
          <CardDescription>
            Geographical and administrative location of the household
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="household_number">Household Number *</Label>
              <Input
                id="household_number"
                value={formData.household_number}
                onChange={(e) => handleInputChange('household_number', e.target.value)}
                placeholder="e.g., EA001-HH001"
                className={errors.household_number ? 'border-red-500' : ''}
              />
              {errors.household_number && <p className="text-red-500 text-sm mt-1">{errors.household_number}</p>}
            </div>

            <div>
              <Label htmlFor="enumeration_area">Enumeration Area</Label>
              <Input
                id="enumeration_area"
                value={formData.enumeration_area}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="province">Province *</Label>
              <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
                <SelectTrigger className={errors.province ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PNG_PROVINCES.map(province => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
            </div>

            <div>
              <Label htmlFor="district">District *</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="Enter district"
                className={errors.district ? 'border-red-500' : ''}
              />
              {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
            </div>

            <div>
              <Label htmlFor="llg_ward">LLG/Ward *</Label>
              <Input
                id="llg_ward"
                value={formData.llg_ward}
                onChange={(e) => handleInputChange('llg_ward', e.target.value)}
                placeholder="Enter LLG/Ward"
                className={errors.llg_ward ? 'border-red-500' : ''}
              />
              {errors.llg_ward && <p className="text-red-500 text-sm mt-1">{errors.llg_ward}</p>}
            </div>

            <div>
              <Label htmlFor="village_settlement">Village/Settlement *</Label>
              <Input
                id="village_settlement"
                value={formData.village_settlement}
                onChange={(e) => handleInputChange('village_settlement', e.target.value)}
                placeholder="Enter village or settlement name"
                className={errors.village_settlement ? 'border-red-500' : ''}
              />
              {errors.village_settlement && <p className="text-red-500 text-sm mt-1">{errors.village_settlement}</p>}
            </div>
          </div>

          <div className="border-t pt-4">
            <Label>GPS Coordinates (Optional)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Latitude"
                value={formData.latitude || ''}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                type="number"
                step="any"
              />
              <Input
                placeholder="Longitude"
                value={formData.longitude || ''}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                type="number"
                step="any"
              />
              <Button type="button" onClick={captureGPSLocation} disabled={useGPS} variant="outline">
                {useGPS ? 'Getting GPS...' : 'Capture GPS'}
              </Button>
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-green-600 mt-1">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                GPS captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dwelling Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Dwelling Characteristics
          </CardTitle>
          <CardDescription>
            Physical characteristics of the dwelling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dwelling_type">Dwelling Type *</Label>
              <Select value={formData.dwelling_type} onValueChange={(value) => handleInputChange('dwelling_type', value as typeof formData.dwelling_type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DWELLING_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="number_of_rooms">Number of Rooms *</Label>
              <Input
                id="number_of_rooms"
                type="number"
                min="1"
                value={formData.number_of_rooms}
                onChange={(e) => handleInputChange('number_of_rooms', parseInt(e.target.value))}
                className={errors.number_of_rooms ? 'border-red-500' : ''}
              />
              {errors.number_of_rooms && <p className="text-red-500 text-sm mt-1">{errors.number_of_rooms}</p>}
            </div>

            <div>
              <Label htmlFor="wall_material">Wall Material *</Label>
              <Select value={formData.wall_material} onValueChange={(value) => handleInputChange('wall_material', value)}>
                <SelectTrigger className={errors.wall_material ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select wall material" />
                </SelectTrigger>
                <SelectContent>
                  {WALL_MATERIALS.map(material => (
                    <SelectItem key={material} value={material}>{material}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.wall_material && <p className="text-red-500 text-sm mt-1">{errors.wall_material}</p>}
            </div>

            <div>
              <Label htmlFor="roof_material">Roof Material *</Label>
              <Select value={formData.roof_material} onValueChange={(value) => handleInputChange('roof_material', value)}>
                <SelectTrigger className={errors.roof_material ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select roof material" />
                </SelectTrigger>
                <SelectContent>
                  {ROOF_MATERIALS.map(material => (
                    <SelectItem key={material} value={material}>{material}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roof_material && <p className="text-red-500 text-sm mt-1">{errors.roof_material}</p>}
            </div>

            <div>
              <Label htmlFor="floor_material">Floor Material *</Label>
              <Select value={formData.floor_material} onValueChange={(value) => handleInputChange('floor_material', value)}>
                <SelectTrigger className={errors.floor_material ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select floor material" />
                </SelectTrigger>
                <SelectContent>
                  {FLOOR_MATERIALS.map(material => (
                    <SelectItem key={material} value={material}>{material}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.floor_material && <p className="text-red-500 text-sm mt-1">{errors.floor_material}</p>}
            </div>

            <div>
              <Label>Dwelling Ownership</Label>
              <Select
                value={formData.owns_dwelling ? 'yes' : 'no'}
                onValueChange={(value) => handleInputChange('owns_dwelling', value === 'yes')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Own dwelling</SelectItem>
                  <SelectItem value="no">Rented/Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Services & Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Basic Services & Amenities
          </CardTitle>
          <CardDescription>
            Access to water, sanitation, and energy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="water_source">Main Water Source *</Label>
              <Select value={formData.water_source} onValueChange={(value) => handleInputChange('water_source', value)}>
                <SelectTrigger className={errors.water_source ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select water source" />
                </SelectTrigger>
                <SelectContent>
                  {WATER_SOURCES.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.water_source && <p className="text-red-500 text-sm mt-1">{errors.water_source}</p>}
            </div>

            <div>
              <Label htmlFor="toilet_facility">Toilet Facility *</Label>
              <Select value={formData.toilet_facility} onValueChange={(value) => handleInputChange('toilet_facility', value)}>
                <SelectTrigger className={errors.toilet_facility ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select toilet facility" />
                </SelectTrigger>
                <SelectContent>
                  {TOILET_FACILITIES.map(facility => (
                    <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.toilet_facility && <p className="text-red-500 text-sm mt-1">{errors.toilet_facility}</p>}
            </div>

            <div>
              <Label htmlFor="electricity_source">Electricity Source *</Label>
              <Select value={formData.electricity_source} onValueChange={(value) => handleInputChange('electricity_source', value)}>
                <SelectTrigger className={errors.electricity_source ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select electricity source" />
                </SelectTrigger>
                <SelectContent>
                  {ELECTRICITY_SOURCES.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.electricity_source && <p className="text-red-500 text-sm mt-1">{errors.electricity_source}</p>}
            </div>

            <div>
              <Label htmlFor="cooking_fuel">Main Cooking Fuel *</Label>
              <Select value={formData.cooking_fuel} onValueChange={(value) => handleInputChange('cooking_fuel', value)}>
                <SelectTrigger className={errors.cooking_fuel ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select cooking fuel" />
                </SelectTrigger>
                <SelectContent>
                  {COOKING_FUELS.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cooking_fuel && <p className="text-red-500 text-sm mt-1">{errors.cooking_fuel}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-between">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 ml-auto"
        >
          {isLoading ? 'Registering Household...' : 'Register Household & Add Members'}
        </Button>
      </div>
    </form>
  )
}
