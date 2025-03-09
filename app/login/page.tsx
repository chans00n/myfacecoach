'use client';

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the landing page which now serves as our sign-up page
    router.push('/');
  }, [router]);

  // Return a minimal loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  )
}
