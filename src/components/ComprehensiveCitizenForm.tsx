'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { User, MapPin, Phone, Mail, Users, Calendar, FileText, Camera } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CitizenFormData {
  full_name: string
  date_of_birth: string
  gender: 'Male' | 'Female' | 'Other'
  place_of_birth: string
  nationality: string
  residential_address: string
  postal_address: string
  phone_number: string
  email: string
  marital_status: string
  occupation: string
  education_level: string
  next_of_kin: string
  next_of_kin_contact: string
  province: string
  district: string
  llg_ward: string
}

interface ComprehensiveCitizenFormProps {
  onSubmit: (data: CitizenFormData) => void
  onCancel: () => void
  isLoading?: boolean
  initialData?: Partial<CitizenFormData>
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

const MARITAL_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
  'De facto'
]

const EDUCATION_LEVELS = [
  'No formal education',
  'Primary education',
  'Secondary education',
  'Tertiary education',
  'University degree',
  'Postgraduate'
]

export function ComprehensiveCitizenForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {}
}: ComprehensiveCitizenFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<CitizenFormData>({
    full_name: '',
    date_of_birth: '',
    gender: 'Male',
    place_of_birth: '',
    nationality: 'Papua New Guinean',
    residential_address: '',
    postal_address: '',
    phone_number: '',
    email: '',
    marital_status: 'Single',
    occupation: '',
    education_level: 'Secondary education',
    next_of_kin: '',
    next_of_kin_contact: '',
    province: '',
    district: '',
    llg_ward: '',
    ...initialData
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CitizenFormData, string>>>({})

  const handleInputChange = (field: keyof CitizenFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CitizenFormData, string>> = {}

    // Required fields validation
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.place_of_birth.trim()) newErrors.place_of_birth = 'Place of birth is required'
    if (!formData.residential_address.trim()) newErrors.residential_address = 'Residential address is required'
    if (!formData.next_of_kin.trim()) newErrors.next_of_kin = 'Next of kin is required'
    if (!formData.next_of_kin_contact.trim()) newErrors.next_of_kin_contact = 'Next of kin contact is required'
    if (!formData.province) newErrors.province = 'Province is required'
    if (!formData.district.trim()) newErrors.district = 'District is required'
    if (!formData.llg_ward.trim()) newErrors.llg_ward = 'LLG/Ward is required'

    // Age validation (must be 18 or older for voting)
    if (formData.date_of_birth) {
      const today = new Date()
      const birthDate = new Date(formData.date_of_birth)
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18) {
        newErrors.date_of_birth = 'Must be 18 years or older for electoral registration'
      }
    }

    // Phone validation
    if (formData.phone_number && !/^\+?[0-9\s\-()]{8,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number'
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const calculateAge = (): number | null => {
    if (!formData.date_of_birth) return null
    const today = new Date()
    const birthDate = new Date(formData.date_of_birth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('register.citizen_registration_title')}
        </h2>
        <p className="text-gray-600">
          {t('register.citizen_registration_subtitle')}
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <FileText className="w-4 h-4 mr-2" />
            {t('register.new_citizen_registration')}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">{t('register.full_name')} *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder={t('register.enter_full_name')}
                  className={errors.full_name ? 'border-red-500' : ''}
                />
                {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <Label htmlFor="date_of_birth">{t('register.date_of_birth')} *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className={errors.date_of_birth ? 'border-red-500' : ''}
                />
                {age !== null && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t('register.age')}: {age} {t('register.years')}
                    {age >= 18 && <span className="text-green-600 ml-2">✓ {t('register.eligible_to_vote')}</span>}
                    {age < 18 && <span className="text-red-600 ml-2">✗ {t('register.not_eligible_to_vote')}</span>}
                  </p>
                )}
                {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
              </div>

              <div>
                <Label htmlFor="gender">{t('register.gender')} *</Label>
                <Select value={formData.gender} onValueChange={(value: 'Male' | 'Female' | 'Other') => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">{t('register.male')}</SelectItem>
                    <SelectItem value="Female">{t('register.female')}</SelectItem>
                    <SelectItem value="Other">{t('register.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="place_of_birth">{t('register.place_of_birth')} *</Label>
                <Input
                  id="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                  placeholder={t('register.enter_place_of_birth')}
                  className={errors.place_of_birth ? 'border-red-500' : ''}
                />
                {errors.place_of_birth && <p className="text-red-500 text-sm mt-1">{errors.place_of_birth}</p>}
              </div>

              <div>
                <Label htmlFor="nationality">{t('register.nationality')} *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder={t('register.enter_nationality')}
                />
              </div>

              <div>
                <Label htmlFor="marital_status">{t('register.marital_status')} *</Label>
                <Select value={formData.marital_status} onValueChange={(value) => handleInputChange('marital_status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>{t(`register.marital_${status.toLowerCase().replace(' ', '_')}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              {t('register.contact_information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="residential_address">{t('register.residential_address')} *</Label>
              <Textarea
                id="residential_address"
                value={formData.residential_address}
                onChange={(e) => handleInputChange('residential_address', e.target.value)}
                placeholder={t('register.enter_residential_address')}
                className={errors.residential_address ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.residential_address && <p className="text-red-500 text-sm mt-1">{errors.residential_address}</p>}
            </div>

            <div>
              <Label htmlFor="postal_address">{t('register.postal_address')}</Label>
              <Textarea
                id="postal_address"
                value={formData.postal_address}
                onChange={(e) => handleInputChange('postal_address', e.target.value)}
                placeholder={t('register.enter_postal_address')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone_number">{t('register.phone_number')}</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder={t('register.enter_phone_number')}
                  className={errors.phone_number ? 'border-red-500' : ''}
                />
                {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
              </div>

              <div>
                <Label htmlFor="email">{t('register.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t('register.enter_email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Administrative Location */}
        <Card>
          <CardHeader>
            <CardTitle>Administrative Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Province *</Label>
                <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
                  <SelectTrigger className={errors.province ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('register.select_province')} />
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
                <Label>District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder={t('register.enter_district')}
                  className={errors.district ? 'border-red-500' : ''}
                />
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
              </div>

              <div>
                <Label>LLG/Ward *</Label>
                <Input
                  id="llg_ward"
                  value={formData.llg_ward}
                  onChange={(e) => handleInputChange('llg_ward', e.target.value)}
                  placeholder={t('register.enter_llg_ward')}
                  className={errors.llg_ward ? 'border-red-500' : ''}
                />
                {errors.llg_ward && <p className="text-red-500 text-sm mt-1">{errors.llg_ward}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {t('register.additional_information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">{t('register.occupation')}</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder={t('register.enter_occupation')}
                />
              </div>

              <div>
                <Label htmlFor="education_level">{t('register.education_level')}</Label>
                <Select value={formData.education_level} onValueChange={(value) => handleInputChange('education_level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map(level => (
                      <SelectItem key={level} value={level}>{t(`register.education_${level.toLowerCase().replace(/\s+/g, '_')}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {t('register.emergency_contact')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next_of_kin">{t('register.next_of_kin')} *</Label>
                <Input
                  id="next_of_kin"
                  value={formData.next_of_kin}
                  onChange={(e) => handleInputChange('next_of_kin', e.target.value)}
                  placeholder={t('register.enter_next_of_kin')}
                  className={errors.next_of_kin ? 'border-red-500' : ''}
                />
                {errors.next_of_kin && <p className="text-red-500 text-sm mt-1">{errors.next_of_kin}</p>}
              </div>

              <div>
                <Label htmlFor="next_of_kin_contact">{t('register.next_of_kin_contact')} *</Label>
                <Input
                  id="next_of_kin_contact"
                  value={formData.next_of_kin_contact}
                  onChange={(e) => handleInputChange('next_of_kin_contact', e.target.value)}
                  placeholder={t('register.enter_next_of_kin_contact')}
                  className={errors.next_of_kin_contact ? 'border-red-500' : ''}
                />
                {errors.next_of_kin_contact && <p className="text-red-500 text-sm mt-1">{errors.next_of_kin_contact}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? t('register.registering') : t('register.register_citizen')}
          </Button>
        </div>
      </form>
    </div>
  )
}
