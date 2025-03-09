'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-8">
        <Image 
          src="/MYFC_block.png" 
          alt="MYFC Logo" 
          width={120} 
          height={120} 
          className="mx-auto"
        />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
      
      <p className="text-lg mb-8 max-w-md">
        It looks like you're not connected to the internet. Some features may not be available.
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={() => router.push('/')}
          className="w-full md:w-auto"
        >
          Try Home Page
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="w-full md:w-auto"
        >
          Retry Connection
        </Button>
      </div>
      
      <div className="mt-12 text-sm text-gray-500">
        <p>Don't worry! Any saved workouts and progress will be available offline.</p>
      </div>
    </div>
  );
} 