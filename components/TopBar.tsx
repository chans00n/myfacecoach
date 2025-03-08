'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Menu, User, Settings, LogOut, Home, CreditCard } from 'lucide-react';

// TopBar component handles user profile display and navigation
export default function TopBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { subscription, isLoading: isLoadingSubscription } = useSubscription();
  const { isInTrial } = useTrialStatus();

  // State for tracking logout process
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle user logout with error handling and loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      setIsLoggingOut(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  // Determine subscription status badge
  const getSubscriptionBadge = () => {
    if (isLoadingSubscription) return null;
    
    if (subscription?.status === 'active') {
      return <Badge variant="lime">Active</Badge>;
    } else if (subscription?.status === 'trialing') {
      return <Badge variant="secondary">Trial</Badge>;
    } else if (isInTrial) {
      return <Badge variant="secondary">Trial</Badge>;
    }
    
    return <Badge variant="outline">Free</Badge>;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <span className="font-semibold hidden md:inline-block">NextTemp</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className={`transition-colors hover:text-foreground/80 ${pathname === '/' ? 'text-foreground font-medium' : 'text-foreground/60'}`}>
            Home
          </Link>
          <Link href="/dashboard" className={`transition-colors hover:text-foreground/80 ${pathname === '/dashboard' ? 'text-foreground font-medium' : 'text-foreground/60'}`}>
            Dashboard
          </Link>
          <Link href="/profile" className={`transition-colors hover:text-foreground/80 ${pathname === '/profile' ? 'text-foreground font-medium' : 'text-foreground/60'}`}>
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || 'User'} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.id.substring(0, 8)}...
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  {getSubscriptionBadge() && (
                    <div className="ml-auto">{getSubscriptionBadge()}</div>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile?tab=billing')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile?tab=account')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-2 cursor-default" 
                    onClick={handleLogout} 
                    isLoading={isLoggingOut}
                  >
                    {!isLoggingOut && <LogOut className="mr-2 h-4 w-4" />}
                    <span>Log out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/login')} variant="default">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 