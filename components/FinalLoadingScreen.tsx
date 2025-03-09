'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface FinalLoadingScreenProps {
  onComplete: () => void;
  userCount?: number; // Optional prop for the user count
}

export function FinalLoadingScreen({ 
  onComplete, 
  userCount = 35908 // Default value if not provided
}: FinalLoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsComplete, setStepsComplete] = useState([false, false, false]);
  const [allComplete, setAllComplete] = useState(false);

  const steps = [
    "Customizing lifts",
    "Creating your optimal plan to improve your facial fitness",
    "Preparing your first lift"
  ];

  // Simulate the loading process
  useEffect(() => {
    const timers = [
      // First step completes after 2 seconds
      setTimeout(() => {
        setStepsComplete(prev => [true, prev[1], prev[2]]);
        setCurrentStep(1);
      }, 2000),
      
      // Second step completes after 4 seconds
      setTimeout(() => {
        setStepsComplete(prev => [prev[0], true, prev[2]]);
        setCurrentStep(2);
      }, 4000),
      
      // Third step completes after 6 seconds
      setTimeout(() => {
        setStepsComplete(prev => [prev[0], prev[1], true]);
        setCurrentStep(3);
      }, 6000),
      
      // All steps complete after 7 seconds
      setTimeout(() => {
        setAllComplete(true);
      }, 7000)
    ];
    
    // Clean up timers
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Handle completion
  const handleComplete = () => {
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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 overflow-y-auto"
        >
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              We need a few seconds to prepare MYFC for you...
            </h1>
            <p className="text-center text-muted-foreground mb-10">
              Please be patient :) Yesterday {userCount.toLocaleString()} people said MYFC helped them enjoy their transformative journey in facial fitness.
            </p>
            
            {/* Loading steps */}
            <div className="space-y-4 mb-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.5 }}
                  animate={{ 
                    opacity: currentStep >= index ? 1 : 0.5,
                    x: stepsComplete[index] ? 0 : -5
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center p-4 rounded-lg ${
                    stepsComplete[index] 
                      ? 'bg-primary/10 text-foreground' 
                      : currentStep === index 
                        ? 'bg-muted text-foreground' 
                        : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <div className="mr-4">
                    {stepsComplete[index] ? (
                      <Check className="h-6 w-6 text-primary" />
                    ) : currentStep === index ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <span className="font-medium">{step}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Complete Setup button - only shown when all steps are complete */}
            {allComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="px-12 py-6 text-lg rounded-full h-auto w-full max-w-xs"
                >
                  Complete Setup
                </Button>
              </motion.div>
            )}
          </motion.div>
          
          {/* Bottom indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bottom-8 w-12 h-1 bg-foreground/20 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 