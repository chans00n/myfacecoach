'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import TopBar from '../components/TopBar';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import { Analytics } from "@vercel/analytics/react"
import { usePathname } from "next/navigation";
// import { PostHogProvider } from '@/contexts/PostHogContext';
// import { PostHogErrorBoundary } from '@/components/PostHogErrorBoundary';

const geist = Geist({ subsets: ['latin'] });

// List of routes where TopBar should not be shown
const NO_TOPBAR_ROUTES = ['/login', '/signup', '/verify-email', '/reset-password', '/update-password'];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showTopBar = !NO_TOPBAR_ROUTES.includes(pathname);

  return (
    <html lang="en">
      <body className={geist.className}>
        <Analytics mode="auto" />
        {/* <PostHogErrorBoundary>
          <PostHogProvider> */}
            <AuthProvider>   
                <ProtectedRoute>
                  {showTopBar && <TopBar />}
                  <main>{children}</main>
                </ProtectedRoute>
            </AuthProvider>
          {/* </PostHogProvider>
        </PostHogErrorBoundary> */}
      </body>
    </html>
  );
}
