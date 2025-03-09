'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface QuestionnaireScreenProps {
  onComplete: (selectedOptions: string[]) => void;
}

export function QuestionnaireScreen({ onComplete }: QuestionnaireScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Options related to facial improvements
  const options = [
    "Reduce facial tension",
    "Improve jawline definition",
    "Diminish fine lines and wrinkles",
    "Enhance facial symmetry",
    "Strengthen facial muscles",
    "Improve overall facial appearance"
  ];

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    setIsVisible(false);
    // Delay the onComplete callback to allow the exit animation to finish
    setTimeout(() => onComplete(selectedOptions), 500);
  };

  const handleSkip = () => {
    setIsVisible(false);
    // Pass empty array if skipped
    setTimeout(() => onComplete([]), 500);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-background p-6 pt-16 overflow-y-auto"
        >
          {/* Skip button */}
          <button 
            onClick={handleSkip}
            className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Skip"
          >
            <span className="text-sm font-medium">Skip</span>
          </button>
          
          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Anything specific you'd like to work on?
            </h1>
            <p className="text-center text-muted-foreground mb-10">
              Your answers won't stop you from accessing any activities and you can change your settings later.
            </p>
            
            {/* Options */}
            <div className="space-y-4 mb-10">
              {options.map((option) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionToggle(option)}
                  className={`
                    p-4 rounded-full border border-border cursor-pointer transition-all
                    ${selectedOptions.includes(option) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background hover:bg-muted'}
                  `}
                >
                  <p className="text-center font-medium">{option}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Next button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleNext}
                size="lg"
                className="px-12 py-6 text-lg rounded-full h-auto w-full max-w-xs"
              >
                Next
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Bottom indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-8 w-12 h-1 bg-foreground/20 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 