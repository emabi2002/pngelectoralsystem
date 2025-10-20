'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

// Define PNG province boundaries (simplified coordinates)
const pngProvinces = {
  'National Capital District': {
    coordinates: [
      [-9.4, 147.0],
      [-9.4, 147.3],
      [-9.7, 147.3],
      [-9.7, 147.0]
    ],
    center: [-9.55, 147.15] as [number, number],
    color: '#FF6B6B'
  },
  'Western': {
    coordinates: [
      [-5.5, 140.8],
      [-5.5, 143.5],
      [-8.0, 143.5],
      [-8.0, 140.8]
    ],
    center: [-6.75, 142.15] as [number, number],
    color: '#4ECDC4'
  },
  'Gulf': {
    coordinates: [
      [-6.5, 143.5],
      [-6.5, 145.5],
      [-8.0, 145.5],
      [-8.0, 143.5]
    ],
    center: [-7.25, 144.5] as [number, number],
    color: '#45B7D1'
  },
  'Central': {
    coordinates: [
      [-8.5, 146.0],
      [-8.5, 147.5],
      [-9.7, 147.5],
      [-9.7, 146.0]
    ],
    center: [-9.1, 146.75] as [number, number],
    color: '#96CEB4'
  },
  'Milne Bay': {
    coordinates: [
      [-9.5, 148.0],
      [-9.5, 152.0],
      [-11.5, 152.0],
      [-11.5, 148.0]
    ],
    center: [-10.5, 150.0] as [number, number],
    color: '#FFEAA7'
  },
  'Western Highlands': {
    coordinates: [
      [-5.0, 143.5],
      [-5.0, 145.0],
      [-6.5, 145.0],
      [-6.5, 143.5]
    ],
    center: [-5.75, 144.25] as [number, number],
    color: '#DDA0DD'
  },
  'Eastern Highlands': {
    coordinates: [
      [-5.5, 145.0],
      [-5.5, 146.5],
      [-7.0, 146.5],
      [-7.0, 145.0]
    ],
    center: [-6.25, 145.75] as [number, number],
    color: '#F19CBB'
  },
  'Morobe': {
    coordinates: [
      [-6.0, 146.5],
      [-6.0, 148.5],
      [-8.0, 148.5],
      [-8.0, 146.5]
    ],
    center: [-7.0, 147.5] as [number, number],
    color: '#A8E6CF'
  },
  'Madang': {
    coordinates: [
      [-4.0, 144.0],
      [-4.0, 146.0],
      [-6.0, 146.0],
      [-6.0, 144.0]
    ],
    center: [-5.0, 145.0] as [number, number],
    color: '#FFB3B3'
  },
  'East Sepik': {
    coordinates: [
      [-3.0, 141.5],
      [-3.0, 144.0],
      [-4.5, 144.0],
      [-4.5, 141.5]
    ],
    center: [-3.75, 142.75] as [number, number],
    color: '#C7CEEA'
  }
}

interface ProvinceData {
  province: string
  votes: number
  stations: number
  registered: number
  turnout: number
}

interface ElectionMapProps {
  provinceData: ProvinceData[]
  onProvinceClick?: (province: string) => void
  className?: string
}

function MapController({
  provinceData,
  onProvinceClick
}: {
  provinceData: ProvinceData[]
  onProvinceClick?: (province: string) => void
}) {
  const map = useMap()

  // Custom icon for polling stations
  const pollingStationIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
        <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"/>
        <path d="M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3"/>
      </svg>
    `),
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
  })

  const getProvinceColor = (province: string, turnout: number) => {
    const baseColor = pngProvinces[province as keyof typeof pngProvinces]?.color || '#CCCCCC'

    // Adjust opacity based on turnout
    const opacity = Math.min(0.9, Math.max(0.3, turnout / 100))
    return baseColor + Math.round(opacity * 255).toString(16).padStart(2, '0')
  }

  const getProvinceStats = (provinceName: string) => {
    return provinceData.find(p => p.province === provinceName) || {
      province: provinceName,
      votes: 0,
      stations: 0,
      registered: 0,
      turnout: 0
    }
  }

  return (
    <>
      {Object.entries(pngProvinces).map(([provinceName, config]) => {
        const stats = getProvinceStats(provinceName)
        const fillColor = getProvinceColor(provinceName, stats.turnout)

        return (
          <Polygon
            key={provinceName}
            positions={config.coordinates as [number, number][]}
            fillColor={fillColor}
            fillOpacity={0.7}
            color="#2563eb"
            weight={2}
            eventHandlers={{
              click: () => onProvinceClick?.(provinceName)
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{provinceName}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Registered Voters:</span>
                    <span className="font-medium">{stats.registered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Votes Cast:</span>
                    <span className="font-medium">{stats.votes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stations Reported:</span>
                    <span className="font-medium">{stats.stations}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Turnout:</span>
                    <span className={`font-bold ${
                      stats.turnout >= 70 ? 'text-green-600' :
                      stats.turnout >= 50 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {stats.turnout.toFixed(1)}%
                    </span>
                  </div>
                </div>
                {stats.stations > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-gray-600">
                      Click for detailed results
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Polygon>
        )
      })}

      {/* Add markers for major polling stations */}
      {provinceData
        .filter(p => p.stations > 0)
        .map(provinceStats => {
          const config = pngProvinces[provinceStats.province as keyof typeof pngProvinces]
          if (!config) return null

          return (
            <Marker
              key={`marker-${provinceStats.province}`}
              position={config.center}
              icon={pollingStationIcon}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-medium">{provinceStats.province}</div>
                  <div className="text-sm text-gray-600">
                    {provinceStats.stations} stations reporting
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
    </>
  )
}

export default function ElectionMap({
  provinceData,
  onProvinceClick,
  className = ''
}: ElectionMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    )
  }

  // PNG center coordinates
  const pngCenter: [number, number] = [-6.5, 145.0]
  const zoom = 6

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={pngCenter}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController
          provinceData={provinceData}
          onProvinceClick={onProvinceClick}
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-medium text-sm mb-2">Voter Turnout</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded opacity-70"></div>
            <span>High (70%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded opacity-70"></div>
            <span>Medium (50-70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded opacity-70"></div>
            <span>Low (&lt;50%)</span>
          </div>
          <div className="flex items-center space-x-2 pt-1 border-t">
            <div className="w-4 h-4 flex items-center justify-center">
              📍
            </div>
            <span>Polling Stations</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Create a dynamic component to avoid SSR issues
export const DynamicElectionMap = dynamic(() => import('./ElectionMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-lg flex items-center justify-center h-96">
      <div className="text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p>Loading map...</p>
      </div>
    </div>
  )
})
