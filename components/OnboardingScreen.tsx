'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { X } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { theme, resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    setIsVisible(false);
    // Delay the onComplete callback to allow the exit animation to finish
    setTimeout(onComplete, 500);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6"
        >
          {/* Close button */}
          <button 
            onClick={handleNext}
            className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Skip"
          >
            <X size={24} />
          </button>
          
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
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
          
          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Elevate Your Routine with Facial Fitness.
          </motion.h1>
          
          {/* Next button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={handleNext}
            className="bg-foreground text-background dark:bg-background dark:text-foreground font-medium rounded-full px-12 py-4 text-lg hover:opacity-90 transition-opacity"
          >
            Next
          </motion.button>
          
          {/* Bottom indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute bottom-8 w-12 h-1 bg-foreground/20 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 