
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const hasAuth = request.cookies.has('auth')
 
  const protectedRoutes = ['/questgen', '/history', '/profile'];

  if (!hasAuth && protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/questgen/:path*', '/history/:path*', '/profile/:path*'],
}
