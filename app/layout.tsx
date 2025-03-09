'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/theme-provider";
import Head from './head';
import '@/utils/amplitude-fix';
import { CookieConsent } from "@/components/ui/cookie-consent";
import { useEffect } from 'react';
import { initializeRealtimeConnection } from '@/utils/websocket-manager';
import dynamic from 'next/dynamic';
// import { PostHogProvider } from '@/contexts/PostHogContext';
// import { PostHogErrorBoundary } from '@/components/PostHogErrorBoundary';

const geist = Geist({ subsets: ['latin'] });

// Dynamically import the InstallPrompt component with SSR disabled
const InstallPrompt = dynamic(() => import('@/components/pwa/InstallPrompt'), { 
  ssr: false 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize WebSocket connection once
  useEffect(() => {
    initializeRealtimeConnection();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body className={geist.className}>
        <Analytics mode="auto" />
        {/* <PostHogErrorBoundary>
          <PostHogProvider> */}
            <ThemeProvider>
              <AuthProvider>   
                <ProtectedRoute>
                  <main>{children}</main>
                  <CookieConsent />
                  <InstallPrompt />
                </ProtectedRoute>
              </AuthProvider>
            </ThemeProvider>
          {/* </PostHogProvider>
        </PostHogErrorBoundary> */}
      </body>
    </html>
  );
}
