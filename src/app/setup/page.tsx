'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Loader2, Database, Settings, Play } from 'lucide-react'
import { initializeSystem, setupDatabase, populateInitialData } from '@/lib/setupDatabase'
import { supabase } from '@/lib/supabase'

interface SetupStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
}

export default function SetupPage() {
  const [isSetupRunning, setIsSetupRunning] = useState(false)
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: 'connection',
      title: 'Supabase Connection',
      description: 'Test connection to Supabase database',
      status: 'pending'
    },
    {
      id: 'tables',
      title: 'Database Tables',
      description: 'Create required database tables',
      status: 'pending'
    },
    {
      id: 'data',
      title: 'Initial Data',
      description: 'Populate PNG provinces and demo data',
      status: 'pending'
    },
    {
      id: 'verification',
      title: 'System Verification',
      description: 'Verify all components are working',
      status: 'pending'
    }
  ])

  const updateStepStatus = (stepId: string, status: SetupStep['status'], message?: string) => {
    setSetupSteps(prev => prev.map(step =>
      step.id === stepId
        ? { ...step, status, message }
        : step
    ))
  }

  const runFullSetup = async () => {
    setIsSetupRunning(true)

    try {
      // Step 1: Test Supabase connection
      updateStepStatus('connection', 'running')
      try {
        const { data, error } = await supabase
          .from('administrative_divisions')
          .select('count')
          .limit(1)

        if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
          throw error
        }

        updateStepStatus('connection', 'success', 'Connected to Supabase successfully')
      } catch (error) {
        updateStepStatus('connection', 'error', `Connection failed: ${error}`)
        throw error
      }

      // Step 2: Setup database tables
      updateStepStatus('tables', 'running')
      try {
        const setupResult = await setupDatabase()
        if (setupResult.success) {
          updateStepStatus('tables', 'success', setupResult.message)
        } else {
          updateStepStatus('tables', 'error', setupResult.error)
          throw new Error(setupResult.error)
        }
      } catch (error) {
        updateStepStatus('tables', 'error', `Database setup failed: ${error}`)
        throw error
      }

      // Step 3: Populate initial data
      updateStepStatus('data', 'running')
      try {
        const dataResult = await populateInitialData()
        if (dataResult.success) {
          updateStepStatus('data', 'success', dataResult.message)
        } else {
          updateStepStatus('data', 'error', dataResult.error)
          throw new Error(dataResult.error)
        }
      } catch (error) {
        updateStepStatus('data', 'error', `Data population failed: ${error}`)
        throw error
      }

      // Step 4: Verification
      updateStepStatus('verification', 'running')
      try {
        // Verify tables exist and have data
        const [votersCheck, resultsCheck, divisionsCheck] = await Promise.all([
          supabase.from('voters').select('count').limit(1),
          supabase.from('polling_results').select('count').limit(1),
          supabase.from('administrative_divisions').select('count').limit(1)
        ])

        const errors = [votersCheck.error, resultsCheck.error, divisionsCheck.error].filter(Boolean)

        if (errors.length === 0) {
          updateStepStatus('verification', 'success', 'System verification completed successfully')
        } else {
          updateStepStatus('verification', 'error', `Verification failed: ${errors[0]?.message}`)
        }
      } catch (error) {
        updateStepStatus('verification', 'error', `Verification failed: ${error}`)
      }

    } catch (error) {
      console.error('Setup failed:', error)
    } finally {
      setIsSetupRunning(false)
    }
  }

  const testConnection = async () => {
    updateStepStatus('connection', 'running')
    try {
      const { data, error } = await supabase
        .from('administrative_divisions')
        .select('count')
        .limit(1)

      if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
        throw error
      }

      updateStepStatus('connection', 'success', 'Supabase connection is working!')
    } catch (error) {
      updateStepStatus('connection', 'error', `Connection failed: ${error}`)
    }
  }

  const getStatusIcon = (status: SetupStep['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status: SetupStep['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'running':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const allStepsCompleted = setupSteps.every(step => step.status === 'success')

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
            <h1 className="text-xl font-semibold text-gray-900">System Setup & Configuration</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            PNG Electoral System Setup
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Initialize the database and configure the system for the workshop demonstration.
            This will set up all required tables and populate initial data.
          </p>
        </div>

        {/* Supabase Connection Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Supabase Configuration</span>
            </CardTitle>
            <CardDescription>
              Current database connection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Project URL:</span>
                <p className="text-gray-600 font-mono break-all">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">API Key:</span>
                <p className="text-gray-600 font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Setup Progress</CardTitle>
            <CardDescription>
              Follow these steps to initialize the PNG Electoral System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <div key={step.id} className={`p-4 rounded-lg border-2 transition-colors ${getStatusColor(step.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        {step.message && (
                          <p className={`text-xs mt-1 ${
                            step.status === 'success' ? 'text-green-700' :
                            step.status === 'error' ? 'text-red-700' : 'text-blue-700'
                          }`}>
                            {step.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {getStatusIcon(step.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={testConnection}
            variant="outline"
            disabled={isSetupRunning}
          >
            <Database className="w-4 h-4 mr-2" />
            Test Connection
          </Button>

          <Button
            onClick={runFullSetup}
            disabled={isSetupRunning}
            size="lg"
          >
            {isSetupRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Full Setup
              </>
            )}
          </Button>
        </div>

        {/* Success Message */}
        {allStepsCompleted && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Setup Complete!
              </h3>
              <p className="text-green-700 mb-4">
                The PNG Electoral System is now ready for the workshop demonstration.
              </p>
              <Link href="/">
                <Button>
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p><strong>Test Connection:</strong> Verify that the application can connect to your Supabase project.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p><strong>Create Tables:</strong> Set up the database schema with all required tables for voters, polling results, and audit logs.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p><strong>Populate Data:</strong> Insert PNG provinces, districts, and sample election data for demonstration.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p><strong>Verify System:</strong> Confirm all components are working correctly and ready for the workshop.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
