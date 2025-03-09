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
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const { user, isLoading: isAuthLoading, supabase, signOut, updateEmail } = useAuth();
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
  // Add state for delete account functionality
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined);
  // Add state for profile editing
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatarUrl: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isEmailChangeModalOpen, setIsEmailChangeModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileError, setProfileError] = useState<string | undefined>(undefined);
  // Add a ref to track if the component is mounted
  const isMounted = React.useRef(true);
  // Add a ref to track if the initial loading is complete
  const initialLoadComplete = React.useRef(false);

  // Set isMounted to false when component unmounts
  useEffect(() => {
    // Clear any existing timers when the component mounts
    const timers = [];
    for (let i = 1; i < 1000; i++) {
      timers.push(clearTimeout(i));
      timers.push(clearInterval(i));
    }

    return () => {
      isMounted.current = false;
      // Clear any timers again when unmounting
      for (let i = 1; i < 1000; i++) {
        clearTimeout(i);
        clearInterval(i);
      }
    };
  }, []);

  // Mark initial load as complete after the first render
  useEffect(() => {
    if (!isAuthLoading && !isLoadingPreferences && isMounted.current) {
      initialLoadComplete.current = true;
    }
  }, [isAuthLoading, isLoadingPreferences]);

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

  // Handle tab query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    
    if (tab && ['subscription', 'account', 'notifications'].includes(tab)) {
      // Set the active tab based on the query parameter
      const tabsElement = document.querySelector(`[data-state="active"][data-orientation="horizontal"][role="tablist"]`);
      if (tabsElement) {
        const tabButton = tabsElement.querySelector(`[value="${tab}"]`);
        if (tabButton) {
          (tabButton as HTMLButtonElement).click();
        }
      }
      
      // Remove the tab parameter from the URL to keep it clean
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete('tab');
      const newUrl = newParams.toString() 
        ? `${window.location.pathname}?${newParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
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

        if (data && isMounted.current) {
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
        if (isMounted.current) {
          setIsLoadingPreferences(false);
        }
      }
    };

    fetchPreferences();
  }, [user, supabase]);

  // Fetch user profile data
  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        // Get user metadata
        const { data, error } = await supabase
          .from('users')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile data:', error);
          return;
        }

        if (data) {
          setProfileData({
            name: data.name || user.user_metadata?.name || '',
            email: user.email || '',
            avatarUrl: data.avatar_url || user.user_metadata?.avatar_url || ''
          });
        } else {
          // If no profile data exists, initialize with user auth data
          setProfileData({
            name: user.user_metadata?.name || '',
            email: user.email || '',
            avatarUrl: user.user_metadata?.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
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

      if (isMounted.current) {
        toast({
          title: "Success",
          description: "Subscription cancelled successfully",
        });
        fetchSubscription();
        setIsCancelModalOpen(false);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to cancel subscription',
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsCancelling(false);
      }
    }
  };

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      await checkWithStripe();
      // Force a refresh of the subscription data
      await fetchSubscription();
      if (isMounted.current) {
        toast({
          title: "Status Updated",
          description: "Your subscription status has been updated.",
        });
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: "Failed to update subscription status. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsCheckingStatus(false);
      }
    }
  };

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
        throw new Error(data.error || 'Failed to open customer portal');
      }

      // Redirect to Stripe Customer Portal
      if (isMounted.current) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to open customer portal',
          variant: "destructive",
        });
      }
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
      
      if (isMounted.current) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        });
      }
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      if (isMounted.current) {
        toast({
          title: "Error saving settings",
          description: "There was a problem saving your preferences. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    setDeleteError(undefined);
    
    try {
      // First check if user has an active subscription
      if (subscription && subscription.status === 'active') {
        throw new Error('Please cancel your subscription before deleting your account.');
      }
      
      // Call the API to delete the account
      const response = await fetch(`/api/user/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }
      
      // Sign out the user
      await signOut();
      
      // Redirect to home page with success message
      router.push('/?deleted=true');
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
      
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to delete account',
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsDeleting(false);
      }
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  // Only show loading spinner on initial load, not on subsequent background refreshes
  if (!initialLoadComplete.current && (isAuthLoading || isLoadingPreferences) && isMounted.current) {
    return <LoadingSpinner />;
  }

  // Handle name update
  const handleUpdateName = async () => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    setProfileError(undefined);
    
    try {
      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { name: profileData.name }
      });
      
      if (metadataError) throw metadataError;
      
      // Update users table
      const { error: dbError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: profileData.name,
          updated_at: new Date().toISOString()
        });
      
      if (dbError) throw dbError;
      
      if (isMounted.current) {
        toast({
          title: "Profile Updated",
          description: "Your name has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating name:', error);
      setProfileError(error instanceof Error ? error.message : 'Failed to update name');
      
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to update name',
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsUpdatingProfile(false);
      }
    }
  };

  // Handle email update
  const handleUpdateEmail = async () => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    setProfileError(undefined);
    
    try {
      // Update email using Auth context
      await updateEmail(newEmail);
      
      if (isMounted.current) {
        toast({
          title: "Email Update Initiated",
          description: "Please check your new email for a confirmation link.",
        });
        setIsEmailChangeModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating email:', error);
      setProfileError(error instanceof Error ? error.message : 'Failed to update email');
      
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to update email',
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsUpdatingProfile(false);
      }
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!user || !avatarFile) return;
    
    setIsUploadingAvatar(true);
    setProfileError(undefined);
    
    try {
      // Upload file to storage
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, avatarFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);
      
      const avatarUrl = urlData.publicUrl;
      
      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      });
      
      if (metadataError) throw metadataError;
      
      // Update users table
      const { error: dbError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });
      
      if (dbError) throw dbError;
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        avatarUrl
      }));
      
      setAvatarFile(null);
      
      if (isMounted.current) {
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setProfileError(error instanceof Error ? error.message : 'Failed to upload avatar');
      
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to upload avatar',
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsUploadingAvatar(false);
      }
    }
  };

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
                          : '$19.99 USD'}
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
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile Avatar */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-border">
                      <AvatarImage src={profileData.avatarUrl} alt={profileData.name || 'User'} />
                      <AvatarFallback className="text-2xl">
                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <p className="text-sm text-muted-foreground mb-2">Upload a new profile picture</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="max-w-xs"
                      />
                      <Button 
                        onClick={handleAvatarUpload} 
                        disabled={!avatarFile || isUploadingAvatar}
                        size="sm"
                      >
                        {isUploadingAvatar ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                            Uploading...
                          </>
                        ) : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="name" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUpdateName} 
                      disabled={isUpdatingProfile || !profileData.name}
                      size="sm"
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Your display name in the application</p>
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input id="email" value={profileData.email} disabled className="flex-1" />
                    <Button 
                      onClick={() => setIsEmailChangeModalOpen(true)} 
                      variant="outline"
                      size="sm"
                    >
                      Change
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Your email address is used for login and notifications</p>
                </div>
                
                {/* User ID (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="user-id">User ID</Label>
                  <Input id="user-id" value={user?.id || ''} disabled />
                  <p className="text-sm text-muted-foreground">Your unique user identifier</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your application preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>

          {/* Danger Zone Card */}
          <Card className="mt-6 border-destructive/20">
            <CardHeader className="border-b border-destructive/20">
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
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

      {/* Delete Account Confirmation Modal */}
      <Dialog 
        open={isDeleteModalOpen} 
        onOpenChange={(open: boolean) => setIsDeleteModalOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
              {subscription && subscription.status === 'active' && (
                <p className="mt-2 font-medium text-destructive">
                  You must cancel your subscription before deleting your account.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {deleteError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {deleteError}
            </div>
          )}
          
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || (subscription && subscription.status === 'active')}
            >
              {isDeleting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Change Modal */}
      <Dialog 
        open={isEmailChangeModalOpen} 
        onOpenChange={(open: boolean) => setIsEmailChangeModalOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Enter your new email address. You'll need to verify this email before the change takes effect.
            </DialogDescription>
          </DialogHeader>
          
          {profileError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {profileError}
            </div>
          )}
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-email">Current Email</Label>
              <Input id="current-email" value={profileData.email} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input 
                id="new-email" 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your new email address"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsEmailChangeModalOpen(false)}
              disabled={isUpdatingProfile}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEmail}
              disabled={isUpdatingProfile || !newEmail || newEmail === profileData.email}
            >
              {isUpdatingProfile ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Updating...
                </>
              ) : (
                'Update Email'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ErrorBoundary 
      fallback={
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="mb-4">There was an error loading your profile information.</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      }
    >
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileContent />
      </Suspense>
    </ErrorBoundary>
  );
} 