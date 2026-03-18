import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isLogin    = req.nextUrl.pathname.startsWith('/login')
  const isCallback = req.nextUrl.pathname.startsWith('/auth')

  const isHome = req.nextUrl.pathname === '/'

  if (!session && !isLogin && !isCallback && !isHome) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
