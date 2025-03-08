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
import { toast } from '@/components/ui/use-toast';

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
      
      // Save to database without full form submission
      const saveThemePreference = async () => {
        try {
          await supabase
            .from('user_preferences')
            .upsert({
              user_id: user.id,
              dark_mode: newDarkMode,
              // Keep existing preferences for other fields
              email_notifications: preferences.email_notifications,
              language: preferences.language,
              updated_at: new Date().toISOString()
            });
        } catch (error) {
          console.error('Error saving theme preference:', error);
        }
      };
      
      saveThemePreference();
    }
  }, [theme, user, preferences, supabase]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPreferences = async () => {
      try {
        const { data } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          const darkMode = data.dark_mode ?? false;
          setPreferences({
            email_notifications: data.email_notifications ?? true,
            dark_mode: darkMode,
            language: data.language ?? 'english'
          });
          
          // Set theme based on stored preference
          setTheme(darkMode ? 'dark' : 'light');
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
        title: "Error",
        description: "Failed to save preferences. Please try again.",
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
    <div className="container mx-auto py-10">
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
            <CardContent className="space-y-4">
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
                <select 
                  id="language"
                  className="w-full p-2 border rounded-md"
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
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
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/profile')}>
                Go to Profile
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
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
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