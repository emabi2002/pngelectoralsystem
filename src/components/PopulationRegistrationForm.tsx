'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  User,
  Accessibility,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PopulationData } from '@/lib/censusInterfaces'
import {
  RELATIONSHIP_TO_HEAD,
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS,
  EDUCATION_LEVELS,
  PNG_ETHNICITIES,
  PNG_RELIGIONS,
  DIFFICULTY_LEVELS,
  DISABILITY_TYPES
} from '@/lib/censusInterfaces'

interface PopulationFormProps {
  householdId: string
  censusId: string
  enumerationArea: string
  enumeratorId: string
  onSubmit: (data: Omit<PopulationData, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function PopulationRegistrationForm({
  householdId,
  censusId,
  enumerationArea,
  enumeratorId,
  onSubmit,
  onCancel,
  isLoading = false
}: PopulationFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Omit<PopulationData, 'id' | 'created_at' | 'updated_at'>>({
    census_id: censusId,
    household_id: householdId,
    nid_number: '',
    birth_certificate_number: '',
    full_name: '',
    date_of_birth: '',
    age: 0,
    gender: 'Male',
    relationship_to_head: 'Head',
    marital_status: 'Never married',
    place_of_birth: '',
    nationality: 'Papua New Guinean',
    ethnicity: '',
    religion: '',
    languages_spoken: [],
    literacy_status: 'Literate',
    highest_education: '',
    current_school_attendance: false,
    occupation: '',
    employment_status: 'Too young to work',
    industry_sector: '',
    migration_status: 'Resident',
    previous_residence: '',
    years_at_current_residence: 0,
    // Washington Group Disability Questions
    difficulty_seeing: 'No difficulty',
    difficulty_hearing: 'No difficulty',
    difficulty_walking: 'No difficulty',
    difficulty_remembering: 'No difficulty',
    difficulty_selfcare: 'No difficulty',
    difficulty_communicating: 'No difficulty',
    has_disability: false,
    disability_type: [],
    receives_disability_support: false,
    // Health
    health_insurance: false,
    chronic_illness: [],
    vaccination_status: '',
    // Biometric
    photo_url: '',
    fingerprint_template: '',
    iris_scan_template: '',
    biometric_quality_score: 0,
    // System
    data_source: 'census',
    is_verified: false,
    enumeration_area: enumerationArea,
    enumerator_id: enumeratorId,
    enumeration_date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [languageInput, setLanguageInput] = useState('')

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-calculate age from date of birth
    if (field === 'date_of_birth' && value) {
      const age = calculateAge(String(value))
      setFormData(prev => ({ ...prev, age }))
    }
  }

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages_spoken.includes(languageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        languages_spoken: [...prev.languages_spoken, languageInput.trim()]
      }))
      setLanguageInput('')
    }
  }

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages_spoken: prev.languages_spoken.filter(l => l !== language)
    }))
  }

  const toggleChronicIllness = (illness: string) => {
    setFormData(prev => ({
      ...prev,
      chronic_illness: prev.chronic_illness?.includes(illness)
        ? prev.chronic_illness.filter(i => i !== illness)
        : [...(prev.chronic_illness || []), illness]
    }))
  }

  const toggleDisabilityType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      disability_type: prev.disability_type?.includes(type)
        ? prev.disability_type.filter(t => t !== type)
        : [...(prev.disability_type || []), type]
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.place_of_birth.trim()) newErrors.place_of_birth = 'Place of birth is required'
    if (!formData.relationship_to_head) newErrors.relationship_to_head = 'Relationship to household head is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Calculate disability status based on Washington Group criteria
      const hasDisability =
        formData.difficulty_seeing === 'A lot of difficulty' ||
        formData.difficulty_seeing === 'Cannot do at all' ||
        formData.difficulty_hearing === 'A lot of difficulty' ||
        formData.difficulty_hearing === 'Cannot do at all' ||
        formData.difficulty_walking === 'A lot of difficulty' ||
        formData.difficulty_walking === 'Cannot do at all' ||
        formData.difficulty_remembering === 'A lot of difficulty' ||
        formData.difficulty_remembering === 'Cannot do at all' ||
        formData.difficulty_selfcare === 'A lot of difficulty' ||
        formData.difficulty_selfcare === 'Cannot do at all' ||
        formData.difficulty_communicating === 'A lot of difficulty' ||
        formData.difficulty_communicating === 'Cannot do at all'

      onSubmit({ ...formData, has_disability: hasDisability })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <User className="w-4 h-4 mr-2" />
          Population Census - Individual Registration
        </Badge>
        <p className="text-sm text-gray-600 mt-2">
          Register all household members (all ages, disability-inclusive)
        </p>
      </div>

      {/* Basic Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Basic demographic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter full name"
                className={errors.full_name ? 'border-red-500' : ''}
              />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className={errors.date_of_birth ? 'border-red-500' : ''}
              />
              {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
            </div>

            <div>
              <Label htmlFor="age">Age (calculated)</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value: typeof formData.gender) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="relationship_to_head">Relationship to Household Head *</Label>
              <Select value={formData.relationship_to_head} onValueChange={(value) => handleInputChange('relationship_to_head', value)}>
                <SelectTrigger className={errors.relationship_to_head ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TO_HEAD.map(rel => (
                    <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.relationship_to_head && <p className="text-red-500 text-sm mt-1">{errors.relationship_to_head}</p>}
            </div>

            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select value={formData.marital_status} onValueChange={(value) => handleInputChange('marital_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL_STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="place_of_birth">Place of Birth *</Label>
              <Input
                id="place_of_birth"
                value={formData.place_of_birth}
                onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                placeholder="Enter place of birth"
                className={errors.place_of_birth ? 'border-red-500' : ''}
              />
              {errors.place_of_birth && <p className="text-red-500 text-sm mt-1">{errors.place_of_birth}</p>}
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Papua New Guinean"
              />
            </div>

            <div>
              <Label htmlFor="ethnicity">Ethnicity (Optional)</Label>
              <Select value={formData.ethnicity || ''} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  {PNG_ETHNICITIES.map(ethnicity => (
                    <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="religion">Religion (Optional)</Label>
              <Select value={formData.religion || ''} onValueChange={(value) => handleInputChange('religion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {PNG_RELIGIONS.map(religion => (
                    <SelectItem key={religion} value={religion}>{religion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nid_number">NID Number (if available)</Label>
              <Input
                id="nid_number"
                value={formData.nid_number || ''}
                onChange={(e) => handleInputChange('nid_number', e.target.value)}
                placeholder="Enter NID number"
              />
            </div>

            <div>
              <Label htmlFor="birth_certificate_number">Birth Certificate Number (if available)</Label>
              <Input
                id="birth_certificate_number"
                value={formData.birth_certificate_number || ''}
                onChange={(e) => handleInputChange('birth_certificate_number', e.target.value)}
                placeholder="Enter birth certificate number"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <Label>Languages Spoken</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                placeholder="Add language"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              />
              <Button type="button" onClick={addLanguage} variant="outline">Add</Button>
            </div>
            {formData.languages_spoken.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages_spoken.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeLanguage(lang)}>
                    {lang} ✕
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Education & Employment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Education & Employment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="literacy_status">Literacy Status</Label>
              <Select value={formData.literacy_status} onValueChange={(value: typeof formData.literacy_status) => handleInputChange('literacy_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Literate">Literate</SelectItem>
                  <SelectItem value="Illiterate">Illiterate</SelectItem>
                  <SelectItem value="Partially literate">Partially literate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="highest_education">Highest Education Level</Label>
              <Select value={formData.highest_education} onValueChange={(value) => handleInputChange('highest_education', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="current_school_attendance"
                checked={formData.current_school_attendance}
                onCheckedChange={(checked) => handleInputChange('current_school_attendance', checked)}
              />
              <Label htmlFor="current_school_attendance" className="cursor-pointer">
                Currently attending school
              </Label>
            </div>

            <div>
              <Label htmlFor="employment_status">Employment Status</Label>
              <Select value={formData.employment_status} onValueChange={(value) => handleInputChange('employment_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_STATUS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation (if employed)</Label>
              <Input
                id="occupation"
                value={formData.occupation || ''}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                placeholder="Enter occupation"
              />
            </div>

            <div>
              <Label htmlFor="industry_sector">Industry Sector (if employed)</Label>
              <Input
                id="industry_sector"
                value={formData.industry_sector || ''}
                onChange={(e) => handleInputChange('industry_sector', e.target.value)}
                placeholder="e.g., Agriculture, Mining, Services"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Washington Group Disability Questions */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <Accessibility className="w-5 h-5 mr-2" />
            Disability Assessment (Washington Group Questions)
          </CardTitle>
          <CardDescription className="text-purple-700">
            International standard questions to identify functional difficulties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white p-4 rounded-lg space-y-4">
            {/* Seeing */}
            <div>
              <Label className="text-base font-semibold">
                Do you have difficulty seeing, even if wearing glasses?
              </Label>
              <Select value={formData.difficulty_seeing} onValueChange={(value: typeof formData.difficulty_seeing) => handleInputChange('difficulty_seeing', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hearing */}
            <div>
              <Label className="text-base font-semibold">
                Do you have difficulty hearing, even if using a hearing aid?
              </Label>
              <Select value={formData.difficulty_hearing} onValueChange={(value: typeof formData.difficulty_hearing) => handleInputChange('difficulty_hearing', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Walking */}
            <div>
              <Label className="text-base font-semibold">
                Do you have difficulty walking or climbing steps?
              </Label>
              <Select value={formData.difficulty_walking} onValueChange={(value: typeof formData.difficulty_walking) => handleInputChange('difficulty_walking', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Remembering */}
            <div>
              <Label className="text-base font-semibold">
                Do you have difficulty remembering or concentrating?
              </Label>
              <Select value={formData.difficulty_remembering} onValueChange={(value: typeof formData.difficulty_remembering) => handleInputChange('difficulty_remembering', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Self-care */}
            <div>
              <Label className="text-base font-semibold">
                Do you have difficulty with self-care (washing or dressing)?
              </Label>
              <Select value={formData.difficulty_selfcare} onValueChange={(value: typeof formData.difficulty_selfcare) => handleInputChange('difficulty_selfcare', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Communicating */}
            <div>
              <Label className="text-base font-semibold">
                Do you have difficulty communicating (understanding or being understood)?
              </Label>
              <Select value={formData.difficulty_communicating} onValueChange={(value: typeof formData.difficulty_communicating) => handleInputChange('difficulty_communicating', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Disability Information */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Type of Disability (if applicable)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {DISABILITY_TYPES.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`disability-${type}`}
                    checked={formData.disability_type?.includes(type)}
                    onCheckedChange={() => toggleDisabilityType(type)}
                  />
                  <Label htmlFor={`disability-${type}`} className="cursor-pointer text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="receives_disability_support"
              checked={formData.receives_disability_support}
              onCheckedChange={(checked) => handleInputChange('receives_disability_support', checked)}
            />
            <Label htmlFor="receives_disability_support" className="cursor-pointer">
              Receives disability support or assistance
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="health_insurance"
              checked={formData.health_insurance}
              onCheckedChange={(checked) => handleInputChange('health_insurance', checked)}
            />
            <Label htmlFor="health_insurance" className="cursor-pointer">
              Has health insurance coverage
            </Label>
          </div>

          <div>
            <Label className="text-base font-semibold mb-2 block">
              Chronic Illness (select all that apply)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {['Diabetes', 'Hypertension', 'Asthma', 'Heart disease', 'Cancer', 'TB', 'HIV/AIDS', 'Other'].map(illness => (
                <div key={illness} className="flex items-center space-x-2">
                  <Checkbox
                    id={`illness-${illness}`}
                    checked={formData.chronic_illness?.includes(illness)}
                    onCheckedChange={() => toggleChronicIllness(illness)}
                  />
                  <Label htmlFor={`illness-${illness}`} className="cursor-pointer text-sm">
                    {illness}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="vaccination_status">Vaccination Status (Optional)</Label>
            <Input
              id="vaccination_status"
              value={formData.vaccination_status || ''}
              onChange={(e) => handleInputChange('vaccination_status', e.target.value)}
              placeholder="e.g., Fully vaccinated, Partially vaccinated"
            />
          </div>
        </CardContent>
      </Card>

      {/* Migration Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Migration & Residence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="migration_status">Migration Status</Label>
              <Select value={formData.migration_status} onValueChange={(value: typeof formData.migration_status) => handleInputChange('migration_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resident">Resident</SelectItem>
                  <SelectItem value="Migrant">Migrant</SelectItem>
                  <SelectItem value="Visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="years_at_current_residence">Years at Current Residence</Label>
              <Input
                id="years_at_current_residence"
                type="number"
                min="0"
                value={formData.years_at_current_residence}
                onChange={(e) => handleInputChange('years_at_current_residence', parseInt(e.target.value) || 0)}
              />
            </div>

            {formData.migration_status === 'Migrant' && (
              <div className="md:col-span-2">
                <Label htmlFor="previous_residence">Previous Residence</Label>
                <Input
                  id="previous_residence"
                  value={formData.previous_residence || ''}
                  onChange={(e) => handleInputChange('previous_residence', e.target.value)}
                  placeholder="Enter previous residence location"
                />
              </div>
            )}
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
          className="bg-blue-600 hover:bg-blue-700 ml-auto"
        >
          {isLoading ? 'Registering Person...' : 'Register Person'}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p className="flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          All information will be kept confidential and used for census purposes only
        </p>
      </div>
    </form>
  )
}
