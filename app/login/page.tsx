'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign up failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Button disabled className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Authenticating...
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Left column - Gradient Background */}
      <div className="relative hidden md:block md:w-1/2 lg:w-2/3">
        <div className="absolute inset-0 z-10 flex flex-col items-start justify-center p-12">
          <div className="max-w-md space-y-4 text-white">
            <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-lg opacity-90">
              Sign in to your account to continue where you left off and access all your features and settings.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
      </div>

      {/* Right column - Login form */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2 lg:w-1/3">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:hidden">Welcome back</h2>
            <h2 className="text-3xl font-bold tracking-tight hidden md:block">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm 
            onSubmit={(email, password, isSignUp) => 
              isSignUp ? handleSignUp(email, password) : handleLogin(email, password)
            }
            onGoogleSignIn={async () => {
              try {
                await signInWithGoogle();
              } catch (error) {
                console.error('Google sign-in failed:', error);
              }
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
} 