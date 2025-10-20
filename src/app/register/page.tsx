'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Camera, Search, User, MapPin, Shield, FileCheck, UserPlus, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { demoFaceRecognitionService } from '@/lib/faceRecognitionDemo'
import { ComprehensiveCitizenForm } from '@/components/ComprehensiveCitizenForm'
import { useTranslation } from 'react-i18next'

// Import enhanced NID service
import { nidService } from '@/lib/nidService'
import { databaseService } from '@/lib/database'

interface NIDCitizen {
  nid_number: string
  full_name: string
  date_of_birth: string
  gender: 'Male' | 'Female' | 'Other'
  place_of_birth: string
  nationality: string
  residential_address: string
  postal_address: string
  phone_number?: string
  email?: string
  marital_status: string
  occupation?: string
  education_level?: string
  next_of_kin: string
  next_of_kin_contact: string
  issue_date: string
  expiry_date: string
  issuing_authority: string
  photo_url?: string
  status: 'active' | 'suspended' | 'expired' | 'revoked'
  province: string
  district: string
  llg_ward: string
  eligibility_for_voting: boolean
  age: number
}

interface ElectoralData {
  nidNumber: string
  pollingStation: string
  registrationOfficerId: string
}

interface BiometricData {
  facialImage: string | null
  faceDescriptor: number[] | null
  faceQualityScore: number
  fingerprintData: string | null
}

type RegistrationStep = 'select_method' | 'nid_input' | 'biometric_input' | 'nid_verification' | 'new_citizen_form' | 'confirmation'

export default function VoterRegistrationPage() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('select_method')
  const [nidNumber, setNidNumber] = useState('')
  const [biometricSample, setBiometricSample] = useState('')
  const [biometricModality, setBiometricModality] = useState<'Fingerprint'|'Face'|'Iris'>('Fingerprint')
  const [citizenData, setCitizenData] = useState<NIDCitizen | null>(null)
  const [electoralData, setElectoralData] = useState<ElectoralData>({
    nidNumber: '',
    pollingStation: '',
    registrationOfficerId: 'OFFICER_001'
  })
  const [biometricData, setBiometricData] = useState<BiometricData>({
    facialImage: null,
    faceDescriptor: null,
    faceQualityScore: 0,
    fingerprintData: null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [nidLookupResult, setNidLookupResult] = useState<{
    found: boolean
    source?: 'png_nid' | 'electoral_system' | 'not_found'
    error?: string
  }>({ found: false })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isProcessingFace, setIsProcessingFace] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Method selection
  const MethodSelect = () => (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Register Citizen</h1>
      <p className="text-gray-600">Start by entering an NID number or identify by biometric sample to fetch details from NID; if not found, continue with full census + electoral template.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button onClick={() => setCurrentStep('nid_input')}>Use NID Number</Button>
        <Button variant="outline" onClick={() => setCurrentStep('biometric_input')}>Identify by Biometric</Button>
      </div>
    </div>
  )

  // NID lookup flow (unchanged core)
  const handleNIDLookup = async () => {
    if (!nidNumber.trim()) {
      setError(t('register.enter_nid_number'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await nidService.lookupCitizen(nidNumber)
      setNidLookupResult(result)

      if (result.found && result.citizen) {
        setCitizenData(result.citizen)
        setElectoralData(prev => ({ ...prev, nidNumber }))
        setCurrentStep('nid_verification')
      } else {
        // Citizen not found - offer choice
        setCurrentStep('new_citizen_form')
      }
    } catch (err) {
      setError(t('register.nid_lookup_error'))
      console.error('NID lookup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Biometric identification -> identify_biometric RPC then NID lookup
  const handleBiometricIdentify = async () => {
    if (!biometricSample.trim()) {
      setError('Please provide a biometric sample string')
      return
    }
    try {
      setIsLoading(true)
      setError('')
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs')
      const supabase = createClientComponentClient()
      const { data, error } = await supabase.rpc('identify_biometric', {
        in_modality: biometricModality,
        in_sample: biometricSample
      })
      if (error) throw error
      if (Array.isArray(data) && data.length > 0 && data[0]?.nid) {
        const nid = data[0].nid as string
        setNidNumber(nid)
        const result = await nidService.lookupCitizen(nid)
        if (result.found && result.citizen) {
          setCitizenData(result.citizen)
          setCurrentStep('nid_verification')
          return
        }
      }
      // Not found -> proceed to new citizen form
      setCurrentStep('new_citizen_form')
    } catch (e: any) {
      setError(e.message || 'Biometric identification failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle new citizen registration
  const handleNewCitizenRegistration = async (formData: {
    full_name: string
    date_of_birth: string
    gender: 'Male' | 'Female' | 'Other'
    place_of_birth: string
    nationality: string
    residential_address: string
    postal_address: string
    phone_number?: string
    email?: string
    marital_status: string
    occupation?: string
    education_level?: string
    next_of_kin: string
    next_of_kin_contact: string
    province: string
    district: string
    llg_ward: string
  }) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await nidService.registerNewCitizen(formData)

      if (result.success && result.citizen) {
        setCitizenData(result.citizen)
        setElectoralData(prev => ({ ...prev, nidNumber: result.nidNumber || '' }))
        setCurrentStep('confirmation')
      } else {
        setError(result.error || t('register.citizen_registration_failed'))
      }
    } catch (err) {
      setError(t('register.unexpected_error'))
      console.error('New citizen registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Facial biometric capture
  const startFacialCapture = useCallback(async () => {
    setIsCameraActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Camera access error:', error)
      alert('Unable to access camera. Please check permissions.')
      setIsCameraActive(false)
    }
  }, [])

  const captureFacialBiometric = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessingFace(true)
      try {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (context) {
          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight
          context.drawImage(videoRef.current, 0, 0)

          const imageData = canvas.toDataURL('image/jpeg', 0.8)

          // Demo face recognition processing
          const faceAnalysis = await demoFaceRecognitionService.detectFace(imageData)

          if (faceAnalysis.success) {
            setBiometricData(prev => ({
              ...prev,
              facialImage: imageData,
              faceDescriptor: faceAnalysis.descriptor || null,
              faceQualityScore: faceAnalysis.qualityScore || 0
            }))

            // Stop camera
            const stream = videoRef.current?.srcObject as MediaStream
            if (stream) {
              stream.getTracks().forEach(track => track.stop())
            }
          } else {
            alert(faceAnalysis.error || 'Face detection failed. Please try again.')
          }
        }
      } catch (error) {
        console.error('Face capture error:', error)
        alert('Failed to capture biometric. Please try again.')
      } finally {
        setIsProcessingFace(false)
        setIsCameraActive(false)
      }
    }
  }, [])

  // Step 4: Submit electoral registration
  const handleSubmit = async () => {
    if (!citizenData || !electoralData.pollingStation) {
      alert('Please complete all required information')
      return
    }

    setIsSubmitting(true)
    try {
      const { databaseService } = await import('@/lib/database')

      const registrationData = {
        nid_smart_id: citizenData.nid_number,
        polling_station: electoralData.pollingStation,
        province: citizenData.province,
        district: citizenData.district,
        llg_ward: citizenData.llg_ward,
        facial_image_url: biometricData.facialImage || undefined,
        face_descriptor: biometricData.faceDescriptor ? JSON.stringify(biometricData.faceDescriptor) : undefined,
        face_quality_score: biometricData.faceQualityScore,
        registration_officer_id: electoralData.registrationOfficerId
      }

      const result = await databaseService.registerVoter(registrationData)

      if (result.success) {
        alert(`✅ Electoral Registration Successful!\n\nRegistration ID: ${result.data?.id}\nNID: ${citizenData.nid_number}\nName: ${citizenData.full_name}\nPolling Station: ${electoralData.pollingStation}\n\nYou are now registered on the electoral roll.`)
        // Reset form
        setCurrentStep('nid_input')
        setNidNumber('')
        setCitizenData(null)
        setElectoralData({ nidNumber: '', pollingStation: '', registrationOfficerId: 'OFFICER_001' })
        setBiometricData({ facialImage: null, faceDescriptor: null, faceQualityScore: 0, fingerprintData: null })
      } else if (result.isDuplicate) {
        alert('⚠️ This NID is already registered on the electoral roll.')
      } else {
        alert(`Registration failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Registration submission error:', error)
      alert('Failed to submit registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="bg-white shadow-sm border-b mb-6">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold">Register Citizen</h1>
            <p className="text-sm text-gray-600">Link to NID when available; otherwise, collect full census and electoral details.</p>
          </div>
        </header>

        {currentStep === 'select_method' && <MethodSelect />}

        {currentStep === 'nid_input' && (
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Enter NID Number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="nid">PNG National ID Number</Label>
              <Input id="nid" value={nidNumber} onChange={e => setNidNumber(e.target.value)} placeholder="e.g., PNG12345678" />
              <Button onClick={handleNIDLookup} disabled={isLoading}>Lookup</Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'biometric_input' && (
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Identify by Biometric</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                {(['Fingerprint','Face','Iris'] as const).map(m => (
                  <Button key={m} variant={biometricModality===m?'default':'outline'} onClick={() => setBiometricModality(m)}>{m}</Button>
                ))}
              </div>
              <Label htmlFor="sample">Sample Template (opaque)</Label>
              <Input id="sample" value={biometricSample} onChange={e => setBiometricSample(e.target.value)} placeholder="Paste sample template string" />
              <Button onClick={handleBiometricIdentify} disabled={isLoading}>Identify</Button>
              {error && <Alert className="mt-2"><AlertDescription>{error}</AlertDescription></Alert>}
            </CardContent>
          </Card>
        )}

        {currentStep === 'nid_verification' && citizenData && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Citizen Found</CardTitle>
              <CardDescription>Data pulled from NID or cached store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><strong>Full Name:</strong> {citizenData.full_name}</div>
                <div><strong>NID:</strong> {citizenData.nid_number}</div>
                <div><strong>DOB:</strong> {citizenData.date_of_birth}</div>
                <div><strong>Gender:</strong> {citizenData.gender}</div>
                <div><strong>Province:</strong> {citizenData.province}</div>
                <div><strong>District:</strong> {citizenData.district}</div>
                <div><strong>LLG/Ward:</strong> {citizenData.llg_ward}</div>
                <div><strong>Status:</strong> {citizenData.status}</div>
              </div>
              <div className="mt-4">
                <Button onClick={() => setCurrentStep('confirmation')}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'new_citizen_form' && (
          <div className="max-w-3xl mx-auto">
            <ComprehensiveCitizenForm onSubmit={() => setCurrentStep('confirmation')} onCancel={() => setCurrentStep('select_method')} />
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-2">Registration Ready</h2>
            <p className="text-gray-600">Citizen record prepared with full census template. Proceed to save and assign electoral attributes as needed.</p>
            <Link href="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link>
          </div>
        )}
      </div>
    </div>
  )
}
