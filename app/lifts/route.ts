import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  // Extract the path from the request URL
  const url = new URL(request.url);
  const path = url.pathname;
  
  // If the path is just /lifts, redirect to /workouts
  if (path === '/lifts') {
    return NextResponse.redirect(new URL('/workouts', request.url));
  }
  
  // Otherwise, redirect to the corresponding path under /workouts
  return NextResponse.redirect(new URL(path.replace('/lifts', '/workouts'), request.url));
} 