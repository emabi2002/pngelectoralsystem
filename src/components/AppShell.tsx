'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

const mainMenu = [
  { href: '/', label: 'Dashboard' },
  { href: '/register', label: 'Register Citizen' },
  { href: '/enumerator/biometrics', label: 'Biometrics Capture' },
  { href: '/polling/verify', label: 'Polling Verify' },
  { href: '/census', label: 'Census' },
  { href: '/results-hub', label: 'Results Hub' },
  { href: '/lpv', label: 'LPV Engine' },
  { href: '/dedupe-pipeline', label: 'Dedupe Pipeline' }
]

const subMenus: Record<string, { href: string; label: string }[]> = {
  '/register': [
    { href: '/register', label: 'Start' },
    { href: '/enumerator/biometrics', label: 'Capture' },
    { href: '/polling/verify', label: 'Verify' }
  ],
  '/census': [
    { href: '/census', label: 'Overview' },
    { href: '/census-dashboard', label: 'Dashboard' },
    { href: '/household-management', label: 'Households' }
  ],
  '/results-hub': [
    { href: '/results-hub', label: 'Transmit' },
    { href: '/dashboard', label: 'Aggregates' }
  ]
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoot = '/' + (pathname.split('/')[1] || '')
  const subs = subMenus[activeRoot] || []

  // On the login page, render children without the application shell
  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="px-4 py-4 font-semibold">PNG Electoral System</div>
        <nav className="px-2 space-y-1">
          {mainMenu.map(item => (
            <Link key={item.href} href={item.href} className={`block px-3 py-2 rounded-md text-sm ${pathname===item.href?'bg-green-100 text-green-700':'hover:bg-gray-100'}`}>{item.label}</Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {/* Top bar submenus */}
        <div className="bg-white border-b px-4 py-2 flex items-center gap-2">
          {subs.length === 0 ? (
            <span className="text-sm text-gray-500">No sub menu</span>
          ) : (
            subs.map(s => (
              <Link key={s.href} href={s.href}>
                <Button variant={pathname===s.href?'default':'outline'} size="sm">{s.label}</Button>
              </Link>
            ))
          )}
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
