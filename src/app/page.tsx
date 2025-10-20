import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Vote, Users, BarChart3, Database, Map, Search, GitBranch, UserCheck } from 'lucide-react'

export default function HomePage() {
  const sections = [
    {
      title: 'Voter Registration',
      description: 'Register new voters with biometric data',
      href: '/register',
      icon: UserCheck,
      color: 'bg-green-600'
    },
    {
      title: 'Census System',
      description: 'Population and household census data collection',
      href: '/census',
      icon: Users,
      color: 'bg-blue-600'
    },
    {
      title: 'Census Dashboard',
      description: 'View census statistics and analytics',
      href: '/census-dashboard',
      icon: BarChart3,
      color: 'bg-purple-600'
    },
    {
      title: 'Biometrics Capture',
      description: 'Capture and verify biometric data',
      href: '/enumerator/biometrics',
      icon: Search,
      color: 'bg-orange-600'
    },
    {
      title: 'Census Monitoring',
      description: 'Monitor enumeration progress and quality',
      href: '/census-monitoring',
      icon: Database,
      color: 'bg-indigo-600'
    },
    {
      title: 'Results Hub',
      description: 'Election results transmission and aggregation',
      href: '/results-hub',
      icon: Vote,
      color: 'bg-red-600'
    },
    {
      title: 'LPV Engine',
      description: 'Limited Preferential Voting calculations',
      href: '/lpv',
      icon: GitBranch,
      color: 'bg-teal-600'
    },
    {
      title: 'Dedupe Pipeline',
      description: 'Biometric deduplication and matching',
      href: '/dedupe-pipeline',
      icon: Map,
      color: 'bg-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-2xl mb-6">
            <Vote className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            PNG Electoral System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Digital Census & Electoral Management System
          </p>
          <div className="mt-4 inline-block bg-yellow-100 border border-yellow-400 rounded-lg px-6 py-3">
            <p className="text-sm font-semibold text-yellow-800">
              🔓 Open Access Mode - No Login Required
            </p>
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-gray-300">
                  <CardHeader>
                    <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Workshop Info */}
        <div className="text-center bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            PNG Electoral Commission Workshop
          </h2>
          <p className="text-lg text-gray-600">
            October 13-15, 2025 • Hilton Hotel, Port Moresby
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Workshop Testing Environment - All Features Unlocked
          </p>
        </div>
      </div>
    </div>
  )
}
