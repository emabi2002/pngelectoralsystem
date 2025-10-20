'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Search, Fingerprint, Database, CheckCircle, XCircle, Download, UserPlus } from 'lucide-react'
import { pngNidApiService, type ElectoralRollRecord, type PngNidCitizen } from '@/lib/pngNidApiService'

type SearchMode = 'nid' | 'fingerprint'

export default function ElectoralSearchPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>('nid')
  const [nidNumber, setNidNumber] = useState('')
  const [fingerprintTemplate, setFingerprintTemplate] = useState('')
  const [searching, setSearching] = useState(false)
  const [importing, setImporting] = useState(false)

  const [searchResult, setSearchResult] = useState<{
    foundInElectoralRoll: boolean
    electoralRollData?: ElectoralRollRecord
    foundInPngNid: boolean
    pngNidData?: PngNidCitizen
    error?: string
  } | null>(null)

  const handleSearch = async () => {
    setSearching(true)
    setSearchResult(null)

    try {
      const result = await pngNidApiService.comprehensiveSearch({
        nidNumber: searchMode === 'nid' ? nidNumber : undefined,
        fingerprintTemplate: searchMode === 'fingerprint' ? fingerprintTemplate : undefined,
      })

      setSearchResult(result)
    } catch (error: any) {
      setSearchResult({
        foundInElectoralRoll: false,
        foundInPngNid: false,
        error: error.message,
      })
    } finally {
      setSearching(false)
    }
  }

  const handleImportFromPngNid = async () => {
    if (!searchResult?.pngNidData) return

    setImporting(true)
    try {
      const result = await pngNidApiService.importToElectoralRoll(searchResult.pngNidData)

      if (result.success && result.data) {
        setSearchResult({
          foundInElectoralRoll: true,
          electoralRollData: result.data,
          foundInPngNid: false,
        })
        alert('Successfully imported to electoral roll!')
      } else {
        alert(`Failed to import: ${result.error}`)
      }
    } catch (error: any) {
      alert(`Import error: ${error.message}`)
    } finally {
      setImporting(false)
    }
  }

  const captureFingerprint = async () => {
    // TODO: Integrate with actual fingerprint scanner SDK
    alert('Fingerprint capture not yet implemented. This will integrate with your biometric device.')
    // Placeholder for demo
    setFingerprintTemplate('FP_TEMPLATE_' + Math.random().toString(36).substring(7))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Electoral Roll Search</h1>
          <p className="text-gray-600">Search electoral roll database and PNG NID system</p>
        </div>

        {/* Search Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Search Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Search Criteria</CardTitle>
              <CardDescription>Choose search method: NID Number or Fingerprint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={searchMode === 'nid' ? 'default' : 'outline'}
                  onClick={() => setSearchMode('nid')}
                  className="flex-1"
                >
                  <Database className="w-4 h-4 mr-2" />
                  NID Number
                </Button>
                <Button
                  variant={searchMode === 'fingerprint' ? 'default' : 'outline'}
                  onClick={() => setSearchMode('fingerprint')}
                  className="flex-1"
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Fingerprint
                </Button>
              </div>

              {/* NID Search */}
              {searchMode === 'nid' && (
                <div className="space-y-2">
                  <Label htmlFor="nid-number">NID Number</Label>
                  <Input
                    id="nid-number"
                    placeholder="Enter NID Number (e.g., PNG123456789)"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                  />
                </div>
              )}

              {/* Fingerprint Search */}
              {searchMode === 'fingerprint' && (
                <div className="space-y-2">
                  <Label>Fingerprint Template</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Fingerprint template data"
                      value={fingerprintTemplate}
                      onChange={(e) => setFingerprintTemplate(e.target.value)}
                      readOnly
                    />
                    <Button onClick={captureFingerprint} variant="outline">
                      <Fingerprint className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                  </div>
                </div>
              )}

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={searching || (!nidNumber && !fingerprintTemplate)}
                className="w-full"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </CardContent>
          </Card>

          {/* Search Workflow Info */}
          <Card>
            <CardHeader>
              <CardTitle>Search Workflow</CardTitle>
              <CardDescription>How the system searches for voters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Search Electoral Roll</p>
                    <p className="text-sm text-gray-600">First searches local electoral roll database</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Query PNG NID System</p>
                    <p className="text-sm text-gray-600">If not found locally, queries PNG NID API</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Import or Register</p>
                    <p className="text-sm text-gray-600">Import from NID or create new registration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className="space-y-6">
            {/* Found in Electoral Roll */}
            {searchResult.foundInElectoralRoll && searchResult.electoralRollData && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <CardTitle className="text-green-900">Found in Electoral Roll</CardTitle>
                    </div>
                    <Badge className="bg-green-600">Registered Voter</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">NID Number</p>
                      <p className="font-semibold">{searchResult.electoralRollData.nid_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold">{searchResult.electoralRollData.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-semibold">{searchResult.electoralRollData.date_of_birth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-semibold">{searchResult.electoralRollData.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Province</p>
                      <p className="font-semibold">{searchResult.electoralRollData.province}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">District</p>
                      <p className="font-semibold">{searchResult.electoralRollData.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">LLG/Ward</p>
                      <p className="font-semibold">{searchResult.electoralRollData.llg_ward}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Polling Station</p>
                      <p className="font-semibold">{searchResult.electoralRollData.polling_station || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={searchResult.electoralRollData.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                        {searchResult.electoralRollData.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registration Date</p>
                      <p className="font-semibold">{new Date(searchResult.electoralRollData.registration_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Source</p>
                      <Badge variant="outline">{searchResult.electoralRollData.source === 'png_nid' ? 'PNG NID' : 'Manual'}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Verified</p>
                      {searchResult.electoralRollData.is_verified ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Found in PNG NID but not in Electoral Roll */}
            {searchResult.foundInPngNid && searchResult.pngNidData && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-6 h-6 text-blue-600" />
                      <CardTitle className="text-blue-900">Found in PNG NID System</CardTitle>
                    </div>
                    <Badge className="bg-blue-600">Not in Electoral Roll</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">NID Number</p>
                      <p className="font-semibold">{searchResult.pngNidData.nid_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold">{searchResult.pngNidData.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-semibold">{searchResult.pngNidData.date_of_birth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-semibold">{searchResult.pngNidData.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Province</p>
                      <p className="font-semibold">{searchResult.pngNidData.province}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">District</p>
                      <p className="font-semibold">{searchResult.pngNidData.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={searchResult.pngNidData.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                        {searchResult.pngNidData.status}
                      </Badge>
                    </div>
                  </div>

                  <Alert>
                    <Download className="w-4 h-4" />
                    <div className="ml-2">
                      <p className="font-semibold">Import to Electoral Roll</p>
                      <p className="text-sm">This citizen is registered in PNG NID but not yet in the electoral roll. Click below to import.</p>
                    </div>
                  </Alert>

                  <Button
                    onClick={handleImportFromPngNid}
                    disabled={importing}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {importing ? 'Importing...' : 'Import to Electoral Roll'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Not Found */}
            {!searchResult.foundInElectoralRoll && !searchResult.foundInPngNid && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-orange-600" />
                    <CardTitle className="text-orange-900">Not Found</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    This citizen was not found in the electoral roll or PNG NID system.
                  </p>

                  <Alert>
                    <UserPlus className="w-4 h-4" />
                    <div className="ml-2">
                      <p className="font-semibold">Manual Registration Required</p>
                      <p className="text-sm">This person needs to be manually registered. Please use the Voter Registration page to create a new record.</p>
                    </div>
                  </Alert>

                  <Button
                    onClick={() => window.location.href = '/register'}
                    className="w-full"
                    size="lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Go to Voter Registration
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Error */}
            {searchResult.error && !searchResult.foundInElectoralRoll && !searchResult.foundInPngNid && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="w-4 h-4 text-red-600" />
                <div className="ml-2">
                  <p className="font-semibold text-red-900">Search Error</p>
                  <p className="text-sm text-red-700">{searchResult.error}</p>
                </div>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
