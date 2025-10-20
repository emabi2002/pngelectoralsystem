'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Home,
  Users,
  MapPin,
  Wifi,
  WifiOff,
  Battery,
  CheckCircle,
  Clock,
  Upload,
  Download,
  Navigation,
  Plus
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function EnumeratorMobilePage() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(true)
  const [gpsEnabled, setGpsEnabled] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'syncing'>('synced')
  const [pendingUploads, setPendingUploads] = useState(3)

  // Session stats
  const [stats] = useState({
    householdsRegistered: 12,
    populationRegistered: 58,
    target: 50,
    startTime: '08:30 AM',
    activeTime: '4h 25m'
  })

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Try to get GPS location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsEnabled(true)
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => setGpsEnabled(false)
      )
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSync = () => {
    setSyncStatus('syncing')
    setTimeout(() => {
      setSyncStatus('synced')
      setPendingUploads(0)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Mobile Header - Compact */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Census Enumerator</h1>
              <p className="text-xs text-gray-600">EA-001 • Port Moresby Central</p>
            </div>
            <div className="flex gap-2">
              {isOnline ? (
                <Badge className="bg-green-600">
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
              {gpsEnabled && (
                <Badge className="bg-blue-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  GPS
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Quick Stats - Touch Optimized */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="touch-manipulation">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Progress</p>
                  <p className="text-3xl font-bold text-green-600">{stats.householdsRegistered}</p>
                  <p className="text-xs text-gray-500">of {stats.target} households</p>
                </div>
                <Home className="w-10 h-10 text-green-200" />
              </div>
              <Progress value={(stats.householdsRegistered / stats.target) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="touch-manipulation">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">People Registered</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.populationRegistered}</p>
                  <p className="text-xs text-gray-500">census records</p>
                </div>
                <Users className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Start Time</p>
                <p className="font-semibold">{stats.startTime}</p>
              </div>
              <div>
                <p className="text-gray-500">Active Time</p>
                <p className="font-semibold">{stats.activeTime}</p>
              </div>
              {currentLocation && (
                <>
                  <div>
                    <p className="text-gray-500">Latitude</p>
                    <p className="font-semibold text-xs">{currentLocation.lat.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Longitude</p>
                    <p className="font-semibold text-xs">{currentLocation.lng.toFixed(6)}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        {!isOnline || pendingUploads > 0 ? (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {syncStatus === 'syncing' ? (
                    <Upload className="w-5 h-5 text-orange-600 animate-bounce" />
                  ) : (
                    <Download className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <p className="font-semibold text-orange-900">
                      {syncStatus === 'syncing' ? 'Syncing...' : `${pendingUploads} records pending upload`}
                    </p>
                    <p className="text-sm text-orange-700">
                      {isOnline ? 'Tap to sync now' : 'Will sync when online'}
                    </p>
                  </div>
                </div>
                {isOnline && pendingUploads > 0 && (
                  <Button
                    size="sm"
                    onClick={handleSync}
                    disabled={syncStatus === 'syncing'}
                    className="touch-manipulation"
                  >
                    Sync
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">All data synced</p>
                  <p className="text-sm text-green-700">Last sync: Just now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Primary Actions - Large Touch Targets */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-16 text-lg touch-manipulation bg-blue-600 hover:bg-blue-700"
          >
            <Home className="w-6 h-6 mr-3" />
            Register New Household
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg touch-manipulation"
          >
            <Users className="w-6 h-6 mr-3" />
            Add Household Member
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg touch-manipulation"
          >
            <MapPin className="w-6 h-6 mr-3" />
            View My Enumeration Area
          </Button>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'household', name: 'HH-EA001-045', time: '10 min ago', synced: true },
                { type: 'person', name: 'Sarah Kila (5 members)', time: '25 min ago', synced: true },
                { type: 'household', name: 'HH-EA001-044', time: '1 hour ago', synced: false }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {activity.type === 'household' ? (
                      <Home className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Users className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{activity.name}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.synced ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GPS Location Card */}
        {gpsEnabled && currentLocation && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Navigation className="w-4 h-4 mr-2" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <p className="font-mono">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Accuracy: High • Last updated: Now
                </p>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3 touch-manipulation">
                <MapPin className="w-4 h-4 mr-2" />
                Refresh Location
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Battery className="w-4 h-4 mr-2" />
              Device Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Connection</span>
                <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GPS</span>
                <span className="font-medium">{gpsEnabled ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-medium">142 MB / 2 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">App Version</span>
                <span className="font-medium">v9.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Notice */}
        {!isOnline && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <WifiOff className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Offline Mode Active</p>
                  <p className="text-sm text-red-700 mt-1">
                    You can continue registering households and members. Data will automatically sync when connection is restored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center gap-1 touch-manipulation active:bg-gray-100">
            <Home className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 touch-manipulation active:bg-gray-100">
            <Plus className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Register</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 touch-manipulation active:bg-gray-100">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Map</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 touch-manipulation active:bg-gray-100">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
