import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { getUser } from '@/utils/supabase-auth';

/**
 * API endpoint to cancel a user's subscription
 * This is a wrapper around the /api/stripe/cancel endpoint
 */
export const POST = withCors(async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { user, error: authError } = await getUser(request);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    // Get the user's subscription from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const supabaseClient = await import('@supabase/supabase-js')
      .then(({ createClient }) => createClient(supabaseUrl, supabaseKey));
    
    const { data: subscriptionData, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();
    
    if (subError) {
      console.error('Error fetching subscription:', subError);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }
    
    if (!subscriptionData?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No subscription found for this user' },
        { status: 404 }
      );
    }
    
    // Forward the request to the stripe cancel endpoint
    const stripeResponse = await fetch(new URL('/api/stripe/cancel', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId: subscriptionData.stripe_subscription_id
      }),
    });
    
    // Return the response from the stripe cancel endpoint
    const data = await stripeResponse.json();
    return NextResponse.json(data, { status: stripeResponse.status });
    
  } catch (error) {
    console.error('Error in subscription cancel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}); 