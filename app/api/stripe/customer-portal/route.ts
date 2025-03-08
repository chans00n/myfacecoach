import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { supabaseAdmin } from '@/utils/supabase-admin';
import Stripe from 'stripe';

/**
 * API endpoint to create a Stripe Customer Portal session
 * This allows customers to manage their subscription directly on Stripe
 */
export const POST = withCors(async function POST(request: NextRequest) {
  try {
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16' as any, // Force type to avoid version mismatch issues
    });

    // Get authentication token
    let userId: string | null = null;
    let stripeCustomerId: string | null = null;
    
    try {
      // Check if the request has a body with userId
      const body = await request.json();
      userId = body.userId || null;
      stripeCustomerId = body.stripeCustomerId || null;
    } catch {
      // If there's no body or it can't be parsed, that's okay
      console.log('No request body or invalid JSON');
    }
    
    // If no userId was provided, try to get it from the user's session
    if (!userId) {
      console.log('No userId provided, trying to get from user session');
      
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
        } catch (error) {
          console.error('Error getting user from token:', error);
        }
      }
    }
    
    // If we still don't have a userId, return an error
    if (!userId) {
      console.error('No user ID found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // If no stripeCustomerId was provided, try to get it from Supabase
    if (!stripeCustomerId) {
      try {
        const { data } = await supabaseAdmin
          .from('subscriptions')
          .select('stripe_customer_id')
          .eq('user_id', userId)
          .single();
        
        if (data?.stripe_customer_id) {
          stripeCustomerId = data.stripe_customer_id;
          console.log('Got stripeCustomerId from user:', stripeCustomerId);
        }
      } catch (error) {
        console.error('Error getting customer ID from user ID:', error);
      }
    }
    
    // If we still don't have a stripeCustomerId, return an error
    if (!stripeCustomerId) {
      console.error('No Stripe customer ID found');
      return NextResponse.json(
        { error: 'No Stripe customer found for this user' },
        { status: 404 }
      );
    }
    
    // Get the return URL (default to the profile page)
    const returnUrl = new URL('/dashboard/profile', request.url).toString();
    
    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    
    // Return the URL to the customer portal
    return NextResponse.json({ url: session.url });
    
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}); 