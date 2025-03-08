'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MobileNav } from '@/components/mobile-nav';
import { SiteHeader } from '@/components/site-header';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MobileFirstLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

/**
 * MobileFirstLayout - A template layout demonstrating mobile-first design principles
 * 
 * Mobile (default):
 * - Full width content
 * - Bottom navigation
 * - No sidebar
 * - Compact spacing
 * 
 * Tablet (md):
 * - More padding
 * - Optional sidebar appears as a drawer
 * 
 * Desktop (lg):
 * - Sidebar visible by default
 * - More generous spacing
 * - Top navigation with expanded options
 */
export function MobileFirstLayout({
  children,
  sidebar,
  className,
}: MobileFirstLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background">
        {/* Header - Simplified on mobile, more options on larger screens */}
        <SiteHeader />
        
        <div className={cn(
          // Mobile (default) layout
          "flex flex-col w-full",
          
          // Desktop layout with sidebar
          "lg:flex-row",
          className
        )}>
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          {sidebar && (
            <aside className="hidden lg:block w-64 shrink-0 border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
              {sidebar}
            </aside>
          )}
          
          {/* Main content - Full width on mobile, adjusted on desktop */}
          <main className={cn(
            // Mobile (default) styles
            "flex-1 px-4 py-6 pb-20", // Extra bottom padding for mobile nav
            
            // Tablet styles
            "md:px-6 md:py-8",
            
            // Desktop styles
            "lg:px-8 lg:py-10 lg:pb-10", // Normal padding on desktop (no mobile nav)
          )}>
            {children}
          </main>
        </div>
        
        {/* Mobile navigation - Only visible on mobile */}
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}

export default MobileFirstLayout; 