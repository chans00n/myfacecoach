"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
    
    // Simulate content loading
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 500); // Short delay to ensure content is ready
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <>
      <LoadingScreen />
      
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <div className="flex justify-center mb-8">
                {mounted && (
                  <Image
                    src={(theme === 'dark' || resolvedTheme === 'dark') 
                      ? "/MYFC_logo_white.png" 
                      : "/MYFC_logo.png"}
                    alt="MYFC Logo"
                    width={100}
                    height={100}
                    priority
                  />
                )}
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <Image
            src="/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg"
            alt="Login background"
            fill
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>
    </>
  );
}

