'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, Subscription } from '@/hooks/useSubscription';
import { AccountManagement } from '@/components/AccountManagement';
import { ErrorBoundary } from 'react-error-boundary';
import { StripeBuyButton } from '@/components/StripeBuyButton';
import { FaCheckCircle, FaCreditCard, FaSync } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/utils/supabase';

// Extend the Subscription type with additional properties
interface ExtendedSubscription extends Subscription {
  plan_name?: string;
  interval?: string;
  amount?: number;
  currency?: string;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { subscription: baseSubscription, fetchSubscription, checkWithStripe } = useSubscription();
  const subscription = baseSubscription as ExtendedSubscription | null;
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    // Check for payment success query params
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const message = params.get('message');
    
    if (success === 'true' && message) {
      setPaymentSuccess(true);
      setPaymentMessage(decodeURIComponent(message));
      
      // Remove query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }
      
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      toast({
        title: "Success",
        description: "Subscription cancelled successfully",
      });
      fetchSubscription();
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to cancel subscription',
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Function to manually check subscription status with Stripe
  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      if (!subscription?.stripe_subscription_id) {
        throw new Error('No subscription ID found');
      }
      
      console.log('Checking subscription status for ID:', subscription.stripe_subscription_id);
      console.log('Current subscription data:', subscription);
      
      await checkWithStripe(subscription.stripe_subscription_id);
      await fetchSubscription();
      
      // Force a page refresh to ensure we get the latest data
      window.location.reload();
      
      toast({
        title: "Success",
        description: "Subscription status updated successfully",
      });
    } catch (error) {
      console.error('Error checking subscription status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to check subscription status',
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Add a function to open the Stripe Customer Portal
  const openStripeCustomerPortal = async () => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }
      
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer portal session');
      }

      // Redirect to the Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening Stripe Customer Portal:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to open Stripe Customer Portal',
        variant: "destructive",
      });
    }
  };

  // Helper function to determine subscription status display
  const getSubscriptionStatus = () => {
    if (!subscription) return { text: 'Inactive', variant: 'destructive' as const };
    
    if (subscription.status === 'active') {
      if (subscription.cancel_at_period_end) {
        return { text: 'Cancelling', variant: 'outline' as const };
      }
      return { text: 'Active', variant: 'lime' as const };
    }
    
    if (subscription.status === 'trialing') {
      return { text: 'Trial', variant: 'secondary' as const };
    }
    
    if (subscription.status === 'past_due') {
      return { text: 'Past Due', variant: 'destructive' as const };
    }
    
    return { text: 'Inactive', variant: 'destructive' as const };
  };

  // Helper function to get the plan name based on subscription status
  const getPlanName = () => {
    if (!subscription) return 'non-MYFC Member';
    
    if (subscription.status === 'active') {
      return 'MYFC Member';
    }
    
    if (subscription.status === 'trialing') {
      return 'Trial MYFC Member';
    }
    
    return 'non-MYFC Member';
  };

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-red-500">
          Failed to load subscription details. Please try refreshing.
        </div>
      }
    >
      <div className="space-y-6">
        {paymentSuccess && (
          <Card className="border-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                <FaCheckCircle className="h-5 w-5" />
                <p>{paymentMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and subscription
          </p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your personal account details</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountManagement />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </div>
              {subscription && (
                <Badge variant={subscriptionStatus.variant}>
                  {subscriptionStatus.text}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Plan</h3>
                    <p className="mt-1 font-medium">{getPlanName()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Billing Period</h3>
                    <p className="mt-1 font-medium">
                      {subscription.interval && subscription.interval !== 'year' && subscription.interval !== 'yearly' 
                        ? 'Monthly' 
                        : subscription.interval === 'year' || subscription.interval === 'yearly'
                          ? 'Yearly'
                          : 'Monthly' /* Default to Monthly if interval is missing or unknown */}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Next Billing Date</h3>
                    <p className="mt-1 font-medium">
                      {subscription.current_period_end
                        ? new Date(subscription.current_period_end).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                    <p className="mt-1 font-medium">
                      ${((subscription.amount || 1999) / 100).toFixed(2)} {subscription.currency?.toUpperCase() || 'USD'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleCheckStatus}
                    disabled={isCheckingStatus}
                    className="flex items-center gap-2"
                  >
                    {isCheckingStatus ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <FaSync className="h-4 w-4" />
                        Verify Status
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="default"
                    onClick={openStripeCustomerPortal}
                    className="flex items-center gap-2"
                  >
                    <FaCreditCard className="h-4 w-4" />
                    Manage Billing
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">You don&apos;t have an active subscription.</p>
                
                <StripeBuyButton
                  buyButtonId={process.env.NEXT_PUBLIC_STRIPE_BUTTON_ID || ''}
                  publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancel Confirmation Modal */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg p-6 max-w-md w-full border shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Cancel Subscription?</h3>
              <p className="text-muted-foreground mb-6">
                You&apos;ll continue to have access until the end of your billing period on {new Date(subscription?.current_period_end || '').toLocaleDateString()}. No refunds are provided for cancellations.
              </p>
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={isCancelling}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="flex items-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileContent />
    </Suspense>
  );
} 