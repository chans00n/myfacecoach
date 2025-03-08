import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { supabaseAdmin } from '@/utils/supabase-admin';
import Stripe from 'stripe';

/**
 * API endpoint to check a user's subscription status directly with Stripe
 * This provides a more reliable way to determine if a subscription is active
 */
export const POST = withCors(async function POST(request: NextRequest) {
  try {
    // Initialize Stripe with default API version
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    // Get authentication token
    let userId: string | null = null;
    let stripeCustomerId: string | null = null;
    let stripeSubscriptionId: string | null = null;
    
    try {
      // Check if the request has a body with userId or subscriptionId
      const body = await request.json();
      userId = body.userId || null;
      stripeCustomerId = body.stripeCustomerId || null;
      stripeSubscriptionId = body.subscriptionId || null;
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
    
    // If no stripeSubscriptionId was provided, try to get it from Supabase
    if (!stripeSubscriptionId) {
      try {
        const { data } = await supabaseAdmin
          .from('subscriptions')
          .select('stripe_subscription_id, stripe_customer_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data?.stripe_subscription_id) {
          stripeSubscriptionId = data.stripe_subscription_id;
          stripeCustomerId = data.stripe_customer_id;
          console.log('Got stripeSubscriptionId from user:', stripeSubscriptionId);
        }
      } catch (error) {
        console.error('Error getting subscription ID from user ID:', error);
      }
    }
    
    // If we still don't have a stripeSubscriptionId, check if the user has a customer ID
    if (!stripeSubscriptionId && !stripeCustomerId) {
      try {
        const { data } = await supabaseAdmin
          .from('customers')
          .select('stripe_customer_id')
          .eq('user_id', userId)
          .single();
        
        if (data?.stripe_customer_id) {
          stripeCustomerId = data.stripe_customer_id;
          console.log('Got stripeCustomerId from customers table:', stripeCustomerId);
        }
      } catch (error) {
        console.error('Error getting customer ID from user ID:', error);
      }
    }
    
    // If we have a customer ID but no subscription ID, look up subscriptions in Stripe
    if (stripeCustomerId && !stripeSubscriptionId) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: 'all',
          limit: 1,
        });
        
        if (subscriptions.data.length > 0) {
          stripeSubscriptionId = subscriptions.data[0].id;
          console.log('Got stripeSubscriptionId from Stripe:', stripeSubscriptionId);
          
          // Update the subscription in Supabase if needed
          try {
            const { data } = await supabaseAdmin
              .from('subscriptions')
              .select('id')
              .eq('user_id', userId)
              .eq('stripe_subscription_id', stripeSubscriptionId)
              .single();
            
            if (!data) {
              // Subscription exists in Stripe but not in Supabase, create it
              await supabaseAdmin.from('subscriptions').insert({
                user_id: userId,
                stripe_customer_id: stripeCustomerId,
                stripe_subscription_id: stripeSubscriptionId,
                status: subscriptions.data[0].status,
                current_period_end: new Date(subscriptions.data[0].current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscriptions.data[0].cancel_at_period_end,
                plan_name: subscriptions.data[0].items.data[0]?.price?.nickname || 'MYFC Member',
                interval: subscriptions.data[0].items.data[0]?.price?.recurring?.interval || 'month',
                amount: subscriptions.data[0].items.data[0]?.price?.unit_amount || 0,
                currency: subscriptions.data[0].items.data[0]?.price?.currency || 'usd',
              });
              console.log('Created subscription in Supabase');
            }
          } catch (error) {
            console.error('Error checking/creating subscription in Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error listing subscriptions from Stripe:', error);
      }
    }
    
    // If we still don't have a stripeSubscriptionId, the user doesn't have a subscription
    if (!stripeSubscriptionId) {
      return NextResponse.json({
        active: false,
        message: 'No subscription found',
      });
    }
    
    // Get the subscription from Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId, {
        expand: ['items.data.price']
      });
      
      console.log('Stripe subscription details:', {
        id: subscription.id,
        status: subscription.status,
        interval: subscription.items.data[0]?.price?.recurring?.interval,
        amount: subscription.items.data[0]?.price?.unit_amount,
        currency: subscription.items.data[0]?.price?.currency,
      });
      
      // Check if the subscription is active
      const isActive = subscription.status === 'active' || 
                       subscription.status === 'trialing' ||
                       (subscription.status === 'canceled' && 
                        subscription.current_period_end > Math.floor(Date.now() / 1000));
      
      // Get the price details
      const priceData = subscription.items.data[0]?.price;
      
      // Force log the raw price data to see exactly what's coming from Stripe
      console.log('Raw price data from Stripe:', JSON.stringify(priceData, null, 2));
      
      // Explicitly check the recurring interval
      let interval = 'month'; // Default to monthly
      if (priceData?.recurring?.interval) {
        interval = priceData.recurring.interval;
        console.log('Found interval in price data:', interval);
      } else {
        console.log('No interval found in price data, using default:', interval);
      }
      
      const amount = priceData?.unit_amount || 1999; // Default to $19.99 if not available
      const currency = priceData?.currency || 'usd';
      
      console.log('Extracted price details:', {
        interval,
        amount,
        currency,
      });
      
      // Update the subscription in Supabase
      try {
        const updateResult = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
            plan_name: priceData?.nickname || 'MYFC Member',
            interval: interval,
            amount: amount,
            currency: currency,
          })
          .eq('stripe_subscription_id', stripeSubscriptionId);
        
        console.log('Updated subscription in Supabase with interval:', interval, 'and amount:', amount);
        console.log('Update result:', updateResult);
        
        // Double-check the updated record
        const { data: updatedSubscription } = await supabaseAdmin
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', stripeSubscriptionId)
          .single();
        
        console.log('Verified updated subscription in Supabase:', updatedSubscription);
      } catch (error) {
        console.error('Error updating subscription in Supabase:', error);
      }
      
      // Return the subscription status
      return NextResponse.json({
        active: isActive,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        plan: {
          id: priceData?.id,
          name: subscription.status === 'active' ? 'MYFC Member' : 'non-MYFC Member',
          amount: amount,
          currency: currency,
          interval: interval,
        },
      });
    } catch (error) {
      console.error('Error retrieving subscription from Stripe:', error);
      
      // If the subscription doesn't exist in Stripe, mark it as inactive in Supabase
      try {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', stripeSubscriptionId);
        
        console.log('Marked subscription as canceled in Supabase');
      } catch (updateError) {
        console.error('Error updating subscription in Supabase:', updateError);
      }
      
      return NextResponse.json({
        active: false,
        message: 'Subscription not found in Stripe',
      });
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}); 