'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Check, AlertCircle, Users, Vote, Send, Camera } from 'lucide-react'

interface PollingData {
  pollingStation: string
  province: string
  district: string
  registeredVoters: string
  totalVotesCast: string
  spoiltBallots: string
  candidateResults: Record<string, string>
  comments: string
}

interface CandidateData {
  id: string
  name: string
  party: string
}

// Mock candidate data
const mockCandidates: CandidateData[] = [
  { id: '1', name: 'Peter O\'Neill', party: 'PNC' },
  { id: '2', name: 'James Marape', party: 'PANGU' },
  { id: '3', name: 'Belden Namah', party: 'URP' },
  { id: '4', name: 'Julius Chan', party: 'PPP' },
  { id: '5', name: 'Don Polye', party: 'THE' }
]

const provinces = [
  'Western', 'Gulf', 'Central', 'National Capital District', 'Milne Bay',
  'Oro', 'Southern Highlands', 'Western Highlands', 'Enga', 'Chimbu',
  'Eastern Highlands', 'Morobe', 'Madang', 'East Sepik', 'Sandaun',
  'Manus', 'New Ireland', 'East New Britain', 'West New Britain', 'Bougainville'
]

export default function PollingResultsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [pollingData, setPollingData] = useState<PollingData>({
    pollingStation: '',
    province: '',
    district: '',
    registeredVoters: '',
    totalVotesCast: '',
    spoiltBallots: '',
    candidateResults: {},
    comments: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleInputChange = (field: keyof PollingData, value: string) => {
    setPollingData(prev => ({ ...prev, [field]: value }))
  }

  const handleCandidateVotes = (candidateId: string, votes: string) => {
    setPollingData(prev => ({
      ...prev,
      candidateResults: { ...prev.candidateResults, [candidateId]: votes }
    }))
  }

  const calculateTotalCandidateVotes = () => {
    return Object.values(pollingData.candidateResults)
      .reduce((sum, votes) => sum + (parseInt(votes) || 0), 0)
  }

  const validateStep1 = () => {
    return pollingData.pollingStation && pollingData.province && pollingData.district
  }

  const validateStep2 = () => {
    const totalVotes = parseInt(pollingData.totalVotesCast) || 0
    const candidateVotes = calculateTotalCandidateVotes()
    const spoiltBallots = parseInt(pollingData.spoiltBallots) || 0
    return totalVotes === candidateVotes + spoiltBallots
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Here we would submit to Supabase
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate upload
      console.log('Submitting polling results:', pollingData)
      alert('Polling results transmitted successfully!')
      setCurrentStep(4)
    } catch (error) {
      console.error('Error submitting results:', error)
      alert('Error transmitting results. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file))
      setUploadedImages(prev => [...prev, ...imageUrls])
    }
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
            <h1 className="text-xl font-semibold text-gray-900">Polling Results Upload</h1>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="max-w-3xl mx-auto">
          {/* Step 1: Station Information */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Polling Station Information</span>
                </CardTitle>
                <CardDescription>
                  Enter the polling station details and voter registration numbers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pollingStation">Polling Station Name *</Label>
                    <Input
                      id="pollingStation"
                      value={pollingData.pollingStation}
                      onChange={(e) => handleInputChange('pollingStation', e.target.value)}
                      placeholder="Enter polling station name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Select value={pollingData.province} onValueChange={(value) => handleInputChange('province', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      value={pollingData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Enter district name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registeredVoters">Registered Voters *</Label>
                    <Input
                      id="registeredVoters"
                      type="number"
                      value={pollingData.registeredVoters}
                      onChange={(e) => handleInputChange('registeredVoters', e.target.value)}
                      placeholder="Number of registered voters"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={nextStep} disabled={!validateStep1()}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Vote Counts */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Vote className="w-5 h-5" />
                  <span>Vote Counts</span>
                </CardTitle>
                <CardDescription>
                  Enter the vote counts for each candidate and spoilt ballots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalVotesCast">Total Votes Cast *</Label>
                    <Input
                      id="totalVotesCast"
                      type="number"
                      value={pollingData.totalVotesCast}
                      onChange={(e) => handleInputChange('totalVotesCast', e.target.value)}
                      placeholder="Total number of votes cast"
                    />
                  </div>
                  <div>
                    <Label htmlFor="spoiltBallots">Spoilt Ballots *</Label>
                    <Input
                      id="spoiltBallots"
                      type="number"
                      value={pollingData.spoiltBallots}
                      onChange={(e) => handleInputChange('spoiltBallots', e.target.value)}
                      placeholder="Number of spoilt ballots"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Candidate Results</h3>
                  <div className="space-y-3">
                    {mockCandidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            value={pollingData.candidateResults[candidate.id] || ''}
                            onChange={(e) => handleCandidateVotes(candidate.id, e.target.value)}
                            placeholder="Votes"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vote Count Validation */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Votes Cast:</span>
                    <span className="font-medium">{pollingData.totalVotesCast || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Candidate Votes:</span>
                    <span className="font-medium">{calculateTotalCandidateVotes()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Spoilt Ballots:</span>
                    <span className="font-medium">{pollingData.spoiltBallots || 0}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center justify-between font-medium">
                      <span>Total Accounted:</span>
                      <span>{calculateTotalCandidateVotes() + (parseInt(pollingData.spoiltBallots) || 0)}</span>
                    </div>
                  </div>
                  {!validateStep2() && pollingData.totalVotesCast && (
                    <div className="flex items-center space-x-2 text-red-600 mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Vote counts do not match. Please verify your entries.</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button onClick={nextStep} disabled={!validateStep2()}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Documentation */}
          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Documentation & Comments</span>
                </CardTitle>
                <CardDescription>
                  Upload photos of result sheets and add any additional comments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="images">Upload Result Sheet Photos</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload photos</p>
                      </div>
                    </label>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {uploadedImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    value={pollingData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    placeholder="Any additional observations or comments about the polling process..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button onClick={nextStep}>
                    Review & Submit
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Review & Submit</span>
                </CardTitle>
                <CardDescription>
                  Review all information before transmitting to central database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Station Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Station:</span> {pollingData.pollingStation}</p>
                      <p><span className="text-gray-600">Province:</span> {pollingData.province}</p>
                      <p><span className="text-gray-600">District:</span> {pollingData.district}</p>
                      <p><span className="text-gray-600">Registered Voters:</span> {pollingData.registeredVoters}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Vote Summary</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Total Votes Cast:</span> {pollingData.totalVotesCast}</p>
                      <p><span className="text-gray-600">Valid Votes:</span> {calculateTotalCandidateVotes()}</p>
                      <p><span className="text-gray-600">Spoilt Ballots:</span> {pollingData.spoiltBallots}</p>
                      <p><span className="text-gray-600">Turnout:</span> {
                        pollingData.registeredVoters && pollingData.totalVotesCast
                          ? `${Math.round((parseInt(pollingData.totalVotesCast) / parseInt(pollingData.registeredVoters)) * 100)}%`
                          : 'N/A'
                      }</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Candidate Results</h3>
                  <div className="space-y-2">
                    {mockCandidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{candidate.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({candidate.party})</span>
                        </div>
                        <span className="font-bold">{pollingData.candidateResults[candidate.id] || 0} votes</span>
                      </div>
                    ))}
                  </div>
                </div>

                {pollingData.comments && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Comments</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{pollingData.comments}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Transmitting...' : 'Transmit Results'}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
