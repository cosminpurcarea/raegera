// Basic middleware with no auth requirements
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Function to check if the path is public
function isPublicPath(path: string): boolean {
  const publicPaths = [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/nouns',
    '/api/nouns/random',
    '/repository',
    '/practice',
    '/_next', // Important for static assets
    '/favicon.ico'
  ];
  
  // Check if path starts with any of the public paths
  return publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`)
  );
}

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
}; 