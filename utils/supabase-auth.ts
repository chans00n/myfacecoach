import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase-admin';

/**
 * Get the authenticated user from the request
 * @param request The Next.js request object
 * @returns The authenticated user or an error
 */
export async function getUser(request: NextRequest) {
  try {
    // Get the session token from the request cookies
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Parse all cookies
    const cookies = parseCookies(cookieHeader);
    
    // Try to find any Supabase auth token
    // Supabase uses different cookie names in different versions and environments
    const possibleTokenNames = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
      'sb:token',
      'supabase-auth-token'
    ];
    
    let authToken = null;
    
    // Check for JWT in various cookie formats
    for (const name of possibleTokenNames) {
      if (cookies[name]) {
        authToken = cookies[name];
        console.log(`Found auth token in cookie: ${name}`);
        break;
      }
    }
    
    // If no token found in cookies, check for Authorization header
    if (!authToken) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7);
        console.log('Found auth token in Authorization header');
      }
    }
    
    if (!authToken) {
      console.log('No auth token found in request');
      return { user: null, error: 'No authentication token found' };
    }
    
    // Use the admin client to get the user from the JWT
    // This is more reliable than creating a new client
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(authToken);
      
      if (error) {
        console.error('Error getting user from token:', error);
        return { user: null, error };
      }
      
      if (!data.user) {
        console.log('No user found for token');
        return { user: null, error: 'Invalid authentication token' };
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Error in supabase auth:', error);
      return { user: null, error };
    }
  } catch (error) {
    console.error('Error in getUser:', error);
    return { user: null, error };
  }
}

/**
 * Parse cookies from a cookie header string
 * @param cookieHeader The cookie header string
 * @returns An object with cookie name-value pairs
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      // Join with = in case the value itself contains =
      const value = parts.slice(1).join('=').trim();
      cookies[name] = value;
    }
  });
  
  return cookies;
} 