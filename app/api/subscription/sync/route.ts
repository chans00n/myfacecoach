import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { supabaseAdmin } from '@/utils/supabase-admin';

/**
 * API endpoint to sync a user's subscription with Stripe
 * This is a wrapper around the /api/stripe/sync endpoint
 */
export const POST = withCors(async function POST(request: NextRequest) {
  try {
    // Try to parse the request body
    let subscriptionId: string | null = null;
    let userId: string | null = null;
    
    try {
      // Check if the request has a body with subscriptionId or userId
      const body = await request.json();
      subscriptionId = body.subscriptionId || null;
      userId = body.userId || null;
    } catch (e) {
      // If there's no body or it can't be parsed, that's okay
      console.log('No request body or invalid JSON');
    }
    
    // If no subscriptionId was provided, try to get it from the user's session
    if (!subscriptionId) {
      console.log('No subscriptionId provided, trying to get from user session');
      
      // Get the user's subscription from Supabase
      // First, we need to get the user ID from the session
      if (!userId) {
        // Create a cookie object from the request
        const cookieHeader = request.headers.get('cookie') || '';
        const cookies: Record<string, string> = {};
        
        cookieHeader.split(';').forEach(cookie => {
          const parts = cookie.split('=');
          if (parts.length >= 2) {
            const name = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            cookies[name] = value;
          }
        });
        
        // Try to find any Supabase auth token
        const possibleTokenNames = [
          'sb-access-token',
          'sb-refresh-token',
          'sb-auth-token',
          'sb:token',
          'supabase-auth-token'
        ];
        
        let authToken = null;
        
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
        
        if (authToken) {
          try {
            // Get the user from the token
            const { data } = await supabaseAdmin.auth.getUser(authToken);
            if (data.user) {
              userId = data.user.id;
              console.log('Got user ID from token:', userId);
            }
          } catch (e) {
            console.error('Error getting user from token:', e);
          }
        }
      }
      
      // If we have a userId, try to get their subscription
      if (userId) {
        try {
          const { data } = await supabaseAdmin
            .from('subscriptions')
            .select('stripe_subscription_id')
            .eq('user_id', userId)
            .single();
          
          if (data?.stripe_subscription_id) {
            subscriptionId = data.stripe_subscription_id;
            console.log('Got subscriptionId from user:', subscriptionId);
          }
        } catch (e) {
          console.error('Error getting subscription from user ID:', e);
        }
      }
    }
    
    // If we still don't have a subscriptionId, return an error
    if (!subscriptionId) {
      console.error('No subscription ID found');
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }
    
    // Forward the request to the stripe sync endpoint
    console.log('Forwarding to stripe sync endpoint with subscriptionId:', subscriptionId);
    const stripeResponse = await fetch(new URL('/api/stripe/sync', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId
      }),
    });
    
    // Return the response from the stripe sync endpoint
    const data = await stripeResponse.json();
    return NextResponse.json(data, { status: stripeResponse.status });
    
  } catch (error) {
    console.error('Error in subscription sync:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}); 