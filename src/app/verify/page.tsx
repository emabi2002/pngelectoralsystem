'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Check, X, AlertCircle, Fingerprint, User, CreditCard, Loader2 } from 'lucide-react'

interface VerificationResult {
  status: 'success' | 'failed' | 'pending'
  nidNumber: string
  fullName?: string
  dateOfBirth?: string
  gender?: string
  province?: string
  district?: string
  issuedDate?: string
  expiryDate?: string
  isValid?: boolean
  voterRegistered?: boolean
}

export default function VerifyIdentityPage() {
  const [nidNumber, setNidNumber] = useState('')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const mockVerification = async (nid: string): Promise<VerificationResult> => {
    // Simulate API call to PNG Digital ID system
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock successful verification for demo
    if (nid === '12345678' || nid.length === 8) {
      return {
        status: 'success',
        nidNumber: nid,
        fullName: 'John Michael Wani',
        dateOfBirth: '1985-03-15',
        gender: 'Male',
        province: 'National Capital District',
        district: 'Moresby North-East',
        issuedDate: '2020-01-15',
        expiryDate: '2030-01-15',
        isValid: true,
        voterRegistered: Math.random() > 0.5 // 50% chance already registered
      }
    } else {
      return {
        status: 'failed',
        nidNumber: nid,
        isValid: false
      }
    }
  }

  const handleVerification = async () => {
    if (!nidNumber) return

    setIsVerifying(true)
    setCurrentStep(2)

    try {
      const result = await mockVerification(nidNumber)
      setVerificationResult(result)
      setCurrentStep(3)
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationResult({
        status: 'failed',
        nidNumber,
        isValid: false
      })
      setCurrentStep(3)
    } finally {
      setIsVerifying(false)
    }
  }

  const resetVerification = () => {
    setNidNumber('')
    setVerificationResult(null)
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Smart ID Verification</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-20 h-1 mx-3 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Enter NID */}
          {currentStep === 1 && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>PNG Smart ID Verification</CardTitle>
                <CardDescription>
                  Enter your National ID or Smart ID number to verify your identity with the PNG Digital ID system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="nidNumber">National ID / Smart ID Number</Label>
                  <Input
                    id="nidNumber"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="Enter 8-digit ID number"
                    className="text-center text-xl tracking-widest"
                    maxLength={8}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the 8-digit number from your National ID or Smart ID card
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Secure Verification</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your ID will be verified against the official PNG Digital Identity database maintained by DICT.
                    All verification requests are encrypted and logged for security purposes.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Demo Instructions:</h3>
                  <p className="text-sm text-gray-600">
                    For demonstration purposes, use <strong>12345678</strong> or any 8-digit number to test the verification process.
                  </p>
                </div>

                <Button
                  onClick={handleVerification}
                  className="w-full"
                  disabled={nidNumber.length !== 8}
                >
                  Verify Identity
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Verifying */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Identity</h2>
                <p className="text-gray-600 mb-4">
                  Connecting to PNG Digital ID database and verifying ID number: <strong>{nidNumber}</strong>
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>Authenticating with DICT servers...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>Validating ID number format...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>Retrieving citizen information...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && verificationResult && (
            <Card>
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  verificationResult.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {verificationResult.status === 'success' ? (
                    <Check className="w-8 h-8 text-green-600" />
                  ) : (
                    <X className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <CardTitle>
                  {verificationResult.status === 'success' ? 'Identity Verified' : 'Verification Failed'}
                </CardTitle>
                <CardDescription>
                  {verificationResult.status === 'success'
                    ? 'Your identity has been successfully verified with the PNG Digital ID system'
                    : 'Unable to verify your identity. Please check your ID number and try again'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {verificationResult.status === 'success' && (
                  <>
                    {/* Personal Information */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-3">Verified Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-green-700 font-medium">Full Name:</span>
                          <p className="text-green-800">{verificationResult.fullName}</p>
                        </div>
                        <div>
                          <span className="text-green-700 font-medium">ID Number:</span>
                          <p className="text-green-800">{verificationResult.nidNumber}</p>
                        </div>
                        <div>
                          <span className="text-green-700 font-medium">Date of Birth:</span>
                          <p className="text-green-800">{verificationResult.dateOfBirth}</p>
                        </div>
                        <div>
                          <span className="text-green-700 font-medium">Gender:</span>
                          <p className="text-green-800">{verificationResult.gender}</p>
                        </div>
                        <div>
                          <span className="text-green-700 font-medium">Province:</span>
                          <p className="text-green-800">{verificationResult.province}</p>
                        </div>
                        <div>
                          <span className="text-green-700 font-medium">District:</span>
                          <p className="text-green-800">{verificationResult.district}</p>
                        </div>
                      </div>
                    </div>

                    {/* ID Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">ID Status</p>
                          <p className="text-sm text-gray-600">
                            Valid until {verificationResult.expiryDate}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </div>

                    {/* Voter Registration Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Voter Registration</p>
                          <p className="text-sm text-gray-600">
                            {verificationResult.voterRegistered
                              ? 'Already registered as a voter'
                              : 'Not yet registered as a voter'
                            }
                          </p>
                        </div>
                      </div>
                      <Badge className={verificationResult.voterRegistered
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                      }>
                        {verificationResult.voterRegistered ? 'Registered' : 'Not Registered'}
                      </Badge>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-3">
                      {!verificationResult.voterRegistered && (
                        <Link href="/register">
                          <Button className="w-full">
                            <Fingerprint className="w-4 h-4 mr-2" />
                            Proceed to Biometric Registration
                          </Button>
                        </Link>
                      )}
                      <Button variant="outline" onClick={resetVerification} className="w-full">
                        Verify Another ID
                      </Button>
                    </div>
                  </>
                )}

                {verificationResult.status === 'failed' && (
                  <>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-800 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Verification Failed</span>
                      </div>
                      <p className="text-sm text-red-700">
                        The ID number <strong>{verificationResult.nidNumber}</strong> could not be verified.
                        This could be due to:
                      </p>
                      <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                        <li>Invalid or expired ID number</li>
                        <li>ID not found in the PNG Digital ID database</li>
                        <li>Temporary system connectivity issues</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <Button onClick={resetVerification} className="w-full">
                        Try Again
                      </Button>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Need help? Contact PNG Electoral Commission support
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
