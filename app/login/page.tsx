'use client';

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import Image from "next/image"

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
          alt="Login background"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-center p-12">
          <div className="max-w-md space-y-4 text-white">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to NextTemp</h1>
            <p className="text-lg opacity-90">
              The modern SaaS template with everything you need to build your next project.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
