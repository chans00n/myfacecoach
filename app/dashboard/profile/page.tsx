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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/utils/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';

// Extend the Subscription type with additional properties
interface ExtendedSubscription extends Subscription {
  plan_name?: string;
  interval?: string;
  amount?: number;
  currency?: string;
  price_id?: string;
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
  const { user, isLoading: isAuthLoading, supabase } = useAuth();
  const { subscription: baseSubscription, fetchSubscription, checkWithStripe } = useSubscription();
  const subscription = baseSubscription as ExtendedSubscription | null;
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    language: 'english'
  });
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);

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

  // Fetch user preferences
  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      setIsLoadingPreferences(true);
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching preferences:', error);
          return;
        }

        if (data) {
          // Extract only the preferences we need
          const { email_notifications, language } = data;
          setPreferences({ 
            email_notifications: email_notifications ?? true, 
            language: language ?? 'english' 
          });
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setIsLoadingPreferences(false);
      }
    };

    fetchPreferences();
  }, [user, supabase]);

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

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      await checkWithStripe();
      toast({
        title: "Status Updated",
        description: "Your subscription status has been updated.",
      });
    } catch (error) {
      console.error('Error checking subscription status:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const openStripeCustomerPortal = async () => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }
      
      const response = await fetch('/api/subscription/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open customer portal');
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to open customer portal',
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
    
    return { text: subscription.status, variant: 'outline' as const };
  };

  // Helper function to get plan name
  const getPlanName = () => {
    if (!subscription) return 'No Plan';
    
    if (subscription.plan_name) {
      return subscription.plan_name;
    }
    
    // Fallback to price ID if plan name is not available
    if (subscription.price_id) {
      // Extract readable name from price ID if possible
      const priceParts = subscription.price_id.split('_');
      if (priceParts.length > 1) {
        return priceParts[1].charAt(0).toUpperCase() + priceParts[1].slice(1);
      }
      return subscription.price_id;
    }
    
    return 'Unknown Plan';
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      
      // Get the current preferences first to preserve dark_mode setting
      const { data: currentPrefs } = await supabase
        .from('user_preferences')
        .select('dark_mode')
        .eq('user_id', user.id)
        .single();
      
      const dark_mode = currentPrefs?.dark_mode || false;
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: preferences.email_notifications,
          dark_mode, // Keep existing dark_mode value
          language: preferences.language,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  if (isAuthLoading || isLoadingPreferences) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile & Settings</h1>
      
      {paymentSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <FaCheckCircle className="text-green-500 mt-0.5 mr-3 text-lg" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300">Payment Successful!</h3>
              <p className="text-green-700 dark:text-green-400 text-sm">{paymentMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="subscription">
        <TabsList className="mb-4">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription">
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
                        {subscription.amount && subscription.currency
                          ? `${(subscription.amount / 100).toFixed(2)} ${subscription.currency.toUpperCase()}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={openStripeCustomerPortal}
                    >
                      <FaCreditCard className="text-muted-foreground" />
                      Manage Billing
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleCheckStatus}
                      disabled={isCheckingStatus}
                    >
                      <FaSync className={`text-muted-foreground ${isCheckingStatus ? 'animate-spin' : ''}`} />
                      {isCheckingStatus ? 'Checking...' : 'Refresh Status'}
                    </Button>
                    
                    {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                      <Button 
                        variant="destructive" 
                        onClick={() => setIsCancelModalOpen(true)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>You don't have an active subscription.</p>
                  <StripeBuyButton 
                    buyButtonId={process.env.NEXT_PUBLIC_STRIPE_BUTTON_ID || ''}
                    publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your personal account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ''} disabled />
                  <p className="text-sm text-muted-foreground">Your email address cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-id">User ID</Label>
                  <Input id="user-id" value={user?.id || ''} disabled />
                  <p className="text-sm text-muted-foreground">Your unique user identifier</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <AccountManagement />
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/reset-password')}>
                Reset Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({...preferences, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Choose your preferred language for the application</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, email_notifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                </div>
                <Switch 
                  id="marketing-emails" 
                  checked={false}
                  disabled
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Toaster />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileContent />
      </Suspense>
    </ErrorBoundary>
  );
} 