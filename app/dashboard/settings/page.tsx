'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function SettingsContent() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    dark_mode: false,
    language: 'english'
  });

  // Effect to sync theme with preferences when component mounts
  useEffect(() => {
    if (preferences.dark_mode) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [preferences.dark_mode, setTheme]);

  // Effect to sync preferences with theme when theme changes externally
  useEffect(() => {
    if (theme === 'dark' && !preferences.dark_mode) {
      setPreferences(prev => ({ ...prev, dark_mode: true }));
    } else if (theme === 'light' && preferences.dark_mode) {
      setPreferences(prev => ({ ...prev, dark_mode: false }));
    }
  }, [theme, preferences.dark_mode]);

  // Effect to save theme preference to database when theme changes
  useEffect(() => {
    if (user && theme && (
      (theme === 'dark' && !preferences.dark_mode) || 
      (theme === 'light' && preferences.dark_mode)
    )) {
      const newDarkMode = theme === 'dark';
      setPreferences(prev => ({ ...prev, dark_mode: newDarkMode }));
      
      // Save to localStorage as a fallback
      try {
        localStorage.setItem('theme_preference', theme);
      } catch (e) {
        console.error('Failed to save theme to localStorage:', e);
      }
      
      // Save to database without full form submission
      const saveThemePreference = async () => {
        try {
          // Only attempt to save to Supabase if we have a valid user
          if (user?.id) {
            const { error } = await supabase
              .from('user_preferences')
              .upsert({
                user_id: user.id,
                dark_mode: newDarkMode,
                // Keep existing preferences for other fields
                email_notifications: preferences.email_notifications,
                language: preferences.language,
                updated_at: new Date().toISOString()
              });
              
            if (error) {
              console.error('Supabase error saving theme preference:', error);
            }
          }
        } catch (error) {
          console.error('Error saving theme preference:', error);
        }
      };
      
      // Debounce the save operation to prevent too many API calls
      const timeoutId = setTimeout(() => {
        saveThemePreference();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [theme, user, preferences, supabase]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPreferences = async () => {
      setIsLoading(true);
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
          setPreferences(data);
          // Set theme based on user preference
          setTheme(data.dark_mode ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user, router, supabase, setTheme]);

  const handleDarkModeToggle = (checked: boolean) => {
    setPreferences({...preferences, dark_mode: checked});
    setTheme(checked ? 'dark' : 'light');
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: preferences.email_notifications,
          dark_mode: preferences.dark_mode,
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={preferences.dark_mode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
              
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
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/dashboard/profile')}>
                Go to Profile
              </Button>
              <Button variant="destructive" onClick={() => router.push('/reset-password')}>
                Reset Password
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SettingsContent />
    </Suspense>
  );
} 