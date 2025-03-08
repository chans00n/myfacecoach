import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

/**
 * Get the authenticated user from the request
 * @param request The Next.js request object
 * @returns The authenticated user or an error
 */
export async function getUser(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': supabaseKey,
        },
      },
    });
    
    // Get the session from the cookies in the request
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [name, ...rest] = cookie.split('=');
        return [name, rest.join('=')];
      })
    );
    
    // Look for Supabase auth cookie
    const supabaseAuthCookie = cookies['sb-access-token'] || 
                              cookies['sb-auth-token'] || 
                              cookies['sb:token'];
    
    if (!supabaseAuthCookie) {
      return { user: null, error: 'No authentication cookie found' };
    }
    
    // Set the auth cookie for the Supabase client
    supabase.auth.setSession({
      access_token: supabaseAuthCookie,
      refresh_token: '',
    });
    
    // Get the user from the session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return { user: null, error };
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Error in getUser:', error);
    return { user: null, error };
  }
} 