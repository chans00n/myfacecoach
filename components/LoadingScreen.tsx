'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

interface LoadingScreenProps {
  minimumLoadTimeMs?: number;
  onComplete?: () => void;
}

export function LoadingScreen({ minimumLoadTimeMs = 1500, onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Ensure the loading screen shows for at least the minimum time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }, minimumLoadTimeMs);

    return () => clearTimeout(timer);
  }, [minimumLoadTimeMs, onComplete]);

  // If not mounted yet, render nothing to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          {/* Progress bar at the top */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden"
            initial={{ width: '100%' }}
          >
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '0%', x: '0%' }}
              animate={{ width: '100%', x: '0%' }}
              transition={{ duration: minimumLoadTimeMs / 1000, ease: 'easeInOut' }}
            />
          </motion.div>
          
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <Image
              src={(theme === 'dark' || resolvedTheme === 'dark') 
                ? "/MYFC_logo_white.png" 
                : "/MYFC_logo.png"}
              alt="MYFC Logo"
              width={120}
              height={120}
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 