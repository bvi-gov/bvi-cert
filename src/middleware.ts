import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/api/auth/login', '/api/auth/setup', '/api/submit-application', '/api/track', '/api/health', '/certificates'];
const STATIC_ASSETS = ['/favicon.ico', '/robots.txt', '/_next', '/logo.svg'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and public paths
  if (STATIC_ASSETS.some(p => pathname.startsWith(p)) || PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/submit-application') || pathname.startsWith('/api/track') || pathname === '/api/health') {
    return NextResponse.next();
  }

  // Allow certificates page (public)
  if (pathname === '/certificates') {
    return NextResponse.next();
  }

  // Check session
  const token = request.cookies.get('bvi_cert_session')?.value;
  if (!token) {
    // API routes return 401, pages redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyToken(token);
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Staff can't access user management
  if (session.role === 'staff' && pathname.startsWith('/users')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Viewer can only view dashboard and search
  if (session.role === 'viewer' && !pathname.startsWith('/dashboard') && !pathname.startsWith('/search') && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user info to headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session.userId);
  requestHeaders.set('x-user-role', session.role);
  requestHeaders.set('x-user-email', session.email);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg).*)'],
};
