'use client';

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col">
            <SiteHeader />
            <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">{children}</main>
          </div>
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
} 