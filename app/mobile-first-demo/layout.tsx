'use client';

import React from 'react';
import MobileFirstLayout from '@/components/layout/mobile-first-layout';

export default function MobileFirstDemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create a simple sidebar for the demo
  const sidebar = (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Mobile-First Guide</h3>
      <nav className="space-y-2">
        <a href="#" className="block p-2 hover:bg-accent/10 rounded-md">Introduction</a>
        <a href="#" className="block p-2 hover:bg-accent/10 rounded-md">Components</a>
        <a href="#" className="block p-2 hover:bg-accent/10 rounded-md">Layouts</a>
        <a href="#" className="block p-2 hover:bg-accent/10 rounded-md">Patterns</a>
        <a href="#" className="block p-2 hover:bg-accent/10 rounded-md">Resources</a>
      </nav>
      <div className="mt-6 p-4 bg-primary/5 rounded-md">
        <p className="text-sm">
          This sidebar is hidden on mobile and appears on desktop screens.
          It's a common pattern in mobile-first design.
        </p>
      </div>
    </div>
  );

  return (
    <MobileFirstLayout sidebar={sidebar}>
      {children}
    </MobileFirstLayout>
  );
} 