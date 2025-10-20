'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Shield, Search, Filter, Download, Calendar, User, Activity } from 'lucide-react'

interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  table: string
  recordId: string
  ipAddress: string
  details: string
  status: 'success' | 'warning' | 'error'
}

// Mock audit data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2025-01-06 14:32:15',
    user: 'john.officer@pngec.gov.pg',
    action: 'INSERT',
    table: 'voters',
    recordId: 'voter_001',
    ipAddress: '10.1.1.45',
    details: 'New voter registration: Jane Doe (NID: 12345678)',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2025-01-06 14:28:03',
    user: 'mary.admin@pngec.gov.pg',
    action: 'UPDATE',
    table: 'polling_results',
    recordId: 'result_456',
    ipAddress: '10.1.1.22',
    details: 'Updated polling results for Station ABC-123',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2025-01-06 14:25:41',
    user: 'peter.observer@pngec.gov.pg',
    action: 'SELECT',
    table: 'voters',
    recordId: '*',
    ipAddress: '10.1.1.67',
    details: 'Accessed voter database for audit review',
    status: 'success'
  },
  {
    id: '4',
    timestamp: '2025-01-06 14:20:18',
    user: 'system@pngec.gov.pg',
    action: 'DELETE',
    table: 'audit_logs',
    recordId: 'audit_789',
    ipAddress: '127.0.0.1',
    details: 'Automated cleanup of old audit logs (90+ days)',
    status: 'warning'
  },
  {
    id: '5',
    timestamp: '2025-01-06 14:15:56',
    user: 'unknown.user',
    action: 'LOGIN_FAILED',
    table: 'auth',
    recordId: 'failed_login',
    ipAddress: '192.168.1.100',
    details: 'Failed login attempt with invalid credentials',
    status: 'error'
  },
  {
    id: '6',
    timestamp: '2025-01-06 14:12:33',
    user: 'sarah.officer@pngec.gov.pg',
    action: 'INSERT',
    table: 'polling_results',
    recordId: 'result_789',
    ipAddress: '10.1.1.89',
    details: 'Transmitted polling results from Station XYZ-456',
    status: 'success'
  }
]

export default function AuditTrailPage() {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')

  useEffect(() => {
    let filtered = mockAuditLogs

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.recordId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter)
    }

    setFilteredLogs(filtered)
  }, [searchTerm, actionFilter, statusFilter, dateFilter])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INSERT': return '+'
      case 'UPDATE': return '✏'
      case 'DELETE': return '🗑'
      case 'SELECT': return '👁'
      case 'LOGIN_FAILED': return '🚫'
      default: return '•'
    }
  }

  const exportAuditLogs = () => {
    const csvContent = [
      'Timestamp,User,Action,Table,Record ID,IP Address,Details,Status',
      ...filteredLogs.map(log =>
        `"${log.timestamp}","${log.user}","${log.action}","${log.table}","${log.recordId}","${log.ipAddress}","${log.details}","${log.status}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Audit Trail</h1>
              <Button variant="outline" size="sm" onClick={exportAuditLogs}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Audit Log Filters</span>
            </CardTitle>
            <CardDescription>
              Filter and search through system activity logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search user, details, or record ID"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Action</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="INSERT">Insert</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="SELECT">Select</SelectItem>
                    <SelectItem value="LOGIN_FAILED">Login Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((filteredLogs.filter(l => l.status === 'success').length / filteredLogs.length) * 100)}%
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(filteredLogs.map(l => l.user)).size}
                  </p>
                </div>
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredLogs.filter(l => l.status === 'error').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity Logs</CardTitle>
            <CardDescription>
              Comprehensive audit trail of all system activities and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">{getActionIcon(log.action)}</span>
                        <Badge className={getStatusBadgeColor(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                        <span className="text-sm text-gray-500">on {log.table}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>👤 {log.user}</span>
                        <span>🌐 {log.ipAddress}</span>
                        <span>🆔 {log.recordId}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{log.timestamp.split(' ')[0]}</div>
                      <div>{log.timestamp.split(' ')[1]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No audit logs found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
