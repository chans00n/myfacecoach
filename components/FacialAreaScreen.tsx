'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface FacialAreaScreenProps {
  onComplete: (selectedAreas: string[]) => void;
}

export function FacialAreaScreen({ onComplete }: FacialAreaScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  // Facial area options with their respective icons/images
  const areas = [
    {
      id: "jaw",
      name: "Jaw & Chin",
      icon: "/icons/jaw-icon.svg",
      description: "Strengthen jawline and reduce tension"
    },
    {
      id: "eyes",
      name: "Eyes & Forehead",
      icon: "/icons/eyes-icon.svg",
      description: "Reduce eye strain and smooth forehead"
    },
    {
      id: "cheeks",
      name: "Cheeks & Smile",
      icon: "/icons/cheeks-icon.svg",
      description: "Enhance natural contours and expression"
    },
    {
      id: "neck",
      name: "Neck & Throat",
      icon: "/icons/neck-icon.svg",
      description: "Improve posture and reduce neck tension"
    }
  ];

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev => 
      prev.includes(areaId)
        ? prev.filter(item => item !== areaId)
        : [...prev, areaId]
    );
  };

  const handleNext = () => {
    setIsVisible(false);
    // Delay the onComplete callback to allow the exit animation to finish
    setTimeout(() => onComplete(selectedAreas), 500);
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
              What area is your focus with facial fitness?
            </h1>
            <p className="text-center text-muted-foreground mb-10">
              Your answers won't stop you from accessing any activities and you can change your settings later.
            </p>
            
            {/* Grid of options */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {areas.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAreaToggle(area.id)}
                  className={`
                    p-4 rounded-xl border border-border cursor-pointer transition-all
                    flex flex-col items-center justify-between h-48
                    ${selectedAreas.includes(area.id) 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-background hover:bg-muted'}
                  `}
                >
                  <div className="flex-1 flex items-center justify-center w-full relative">
                    <div className="w-20 h-20">
                      <div className={`w-full h-full ${selectedAreas.includes(area.id) ? 'text-primary' : 'text-muted-foreground'}`}>
                        <Image
                          src={area.icon}
                          alt={area.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="font-medium">{area.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Next button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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