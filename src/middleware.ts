import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Complete bypass: all routes open for testing
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
