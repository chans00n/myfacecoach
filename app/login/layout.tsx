'use client';

import { AuthProvider } from '@/contexts/AuthContext';

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <main className="h-screen">{children}</main>
    </AuthProvider>
  );
} 