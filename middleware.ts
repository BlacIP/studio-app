import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hostname = request.headers.get('host')?.split(':')[0] || '';
  const customDomain =
    process.env.CUSTOM_DOMAIN_BASE || process.env.NEXT_PUBLIC_CUSTOM_DOMAIN_BASE || '';

  const isReservedPath =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/onboarding') ||
    path.startsWith('/admin') ||
    path.startsWith('/settings');

  if (customDomain && hostname.endsWith(`.${customDomain}`)) {
    const studioSlug = hostname.replace(`.${customDomain}`, '');
    if (studioSlug && !isReservedPath) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/${studioSlug}${path}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // Protect authenticated studio routes
  if (
    path.startsWith('/admin') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/onboarding') ||
    path.startsWith('/settings')
  ) {
    const token = request.cookies.get('token')?.value;

    // Check if token exists
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // In a decoupled architecture, we let the backend validate the token.
    // If the token is invalid, API calls will fail with 401, handling the redirect there.
    return NextResponse.next();
  }

  // Redirect root to login
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
