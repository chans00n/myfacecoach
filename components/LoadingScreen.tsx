'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

interface LoadingScreenProps {
  minimumLoadTimeMs?: number;
}

export function LoadingScreen({ minimumLoadTimeMs = 1500 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Ensure the loading screen shows for at least the minimum time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minimumLoadTimeMs);

    return () => clearTimeout(timer);
  }, [minimumLoadTimeMs]);

  // If not mounted yet, render nothing to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
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
            <motion.div 
              className="mt-8 h-1 w-24 bg-primary/20 rounded-full overflow-hidden"
              initial={{ width: '6rem' }}
            >
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: minimumLoadTimeMs / 1000, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 