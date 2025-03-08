'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import debounce from 'lodash/debounce';

export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  cancel_at_period_end: boolean;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user, supabase } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastStripeCheck, setLastStripeCheck] = useState<number>(0);

  const subscriptionCache = new Map<string, {data: Subscription | null, timestamp: number}>();
  const CACHE_DURATION = 30000; // 30 seconds
  const STRIPE_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  const checkWithStripe = useCallback(async (subscriptionId?: string) => {
    if (!user?.id) return null;
    
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }
      
      const response = await fetch('/api/subscription/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          subscriptionId: subscriptionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check subscription with Stripe');
      }

      const data = await response.json();
      setLastStripeCheck(Date.now());
      
      if (data.active) {
        // If the subscription is active in Stripe, update our local state
        // and trigger a refresh of the subscription data from Supabase
        await fetchSubscriptionFromSupabase();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking with Stripe:', error);
      return null;
    }
  }, [user?.id, supabase]);

  const fetchSubscriptionFromSupabase = useCallback(async () => {
    if (!user?.id) {
      setSubscription(null);
      setLoading(false);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      // Check if we have a valid subscription
      const validSubscription = data && data.length > 0 ? data[0] : null;
      const isValid = validSubscription && 
        ['active', 'trialing'].includes(validSubscription.status) && 
        new Date(validSubscription.current_period_end) > new Date();

      const result = isValid ? validSubscription : null;
      
      return result;
    } catch (err) {
      console.error('Subscription fetch error from Supabase:', err);
      return null;
    }
  }, [user?.id, supabase]);

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Check cache first
    const cached = subscriptionCache.get(user.id);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      setSubscription(cached.data);
      setLoading(false);
      
      // If it's been a while since we checked with Stripe, do a background check
      if (now - lastStripeCheck > STRIPE_CHECK_INTERVAL) {
        checkWithStripe(cached.data?.stripe_subscription_id);
      }
      
      return;
    }

    try {
      // First try to get the subscription from Supabase
      const supabaseSubscription = await fetchSubscriptionFromSupabase();
      
      // If we found a subscription in Supabase, use it
      if (supabaseSubscription) {
        // Update cache
        subscriptionCache.set(user.id, {
          data: supabaseSubscription,
          timestamp: now
        });
        
        setSubscription(supabaseSubscription);
        
        // If it's been a while since we checked with Stripe, do a background check
        if (now - lastStripeCheck > STRIPE_CHECK_INTERVAL) {
          checkWithStripe(supabaseSubscription.stripe_subscription_id);
        }
      } else {
        // If we didn't find a subscription in Supabase, check with Stripe
        const isActiveInStripe = await checkWithStripe();
        
        if (isActiveInStripe) {
          // If active in Stripe, we should now have an updated record in Supabase
          const refreshedSubscription = await fetchSubscriptionFromSupabase();
          
          // Update cache
          subscriptionCache.set(user.id, {
            data: refreshedSubscription,
            timestamp: now
          });
          
          setSubscription(refreshedSubscription);
        } else {
          // No active subscription found
          subscriptionCache.set(user.id, {
            data: null,
            timestamp: now
          });
          
          setSubscription(null);
        }
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError('Failed to load subscription');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase, lastStripeCheck, fetchSubscriptionFromSupabase, checkWithStripe]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const checkValidSubscription = useCallback((data: Subscription[]): boolean => {
    return data.some(sub => 
      ['active', 'trialing'].includes(sub.status) &&
      new Date(sub.current_period_end) > new Date()
    );
  }, []);

  const MAX_SYNC_RETRIES = 3;
  const [syncRetries, setSyncRetries] = useState(0);

  const debouncedSyncWithStripe = useCallback(
    debounce(async (subscriptionId: string) => {
      if (syncRetries >= MAX_SYNC_RETRIES) {
        console.log('Max sync retries reached');
        return;
      }

      try {
        const response = await fetch('/api/stripe/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to sync with Stripe');
        }
        
        await fetchSubscription();
        setSyncRetries(0); // Reset retries on success
      } catch (error) {
        console.error('Error syncing with Stripe:', error);
        setError(error instanceof Error ? error.message : 'Failed to sync with Stripe');
        setSyncRetries(prev => prev + 1);
      }
    }, 30000), // 30 second delay between calls
    [fetchSubscription, syncRetries]
  );

  const syncWithStripe = useCallback((subscriptionId: string) => {
    debouncedSyncWithStripe(subscriptionId);
  }, [debouncedSyncWithStripe]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('subscription_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          const isValid = checkValidSubscription([payload.new as Subscription]);
          setSubscription(isValid ? payload.new as Subscription : null);
          if (!isValid) {
            console.log('Subscription expired or invalidated');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, checkValidSubscription]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (subscription?.stripe_subscription_id) {
      // Add a delay before first sync
      timeoutId = setTimeout(() => {
        syncWithStripe(subscription.stripe_subscription_id);
      }, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [syncWithStripe, subscription?.stripe_subscription_id]);

  return {
    subscription,
    isLoading: loading,
    error,
    checkWithStripe,
    fetchSubscription
  };
} 