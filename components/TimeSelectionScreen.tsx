'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';

interface TimeSelectionScreenProps {
  onComplete: (timePreference: { period: string; time: string }) => void;
}

export function TimeSelectionScreen({ onComplete }: TimeSelectionScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [period, setPeriod] = useState<'MORNING' | 'DAY' | 'EVENING'>('MORNING');
  const [hours, setHours] = useState<string>('09');
  const [minutes, setMinutes] = useState<string>('00');
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM');
  
  const hourPickerRef = useRef<HTMLDivElement>(null);
  const minutePickerRef = useRef<HTMLDivElement>(null);
  
  // Set default time based on selected period
  useEffect(() => {
    if (period === 'MORNING') {
      setHours('09');
      setMinutes('00');
      setAmPm('AM');
    } else if (period === 'DAY') {
      setHours('02');
      setMinutes('30');
      setAmPm('PM');
    } else if (period === 'EVENING') {
      setHours('09');
      setMinutes('00');
      setAmPm('PM');
    }
  }, [period]);

  const handleComplete = () => {
    setIsVisible(false);
    // Format the time string
    const timeString = `${hours}:${minutes} ${amPm}`;
    // Delay the onComplete callback to allow the exit animation to finish
    setTimeout(() => onComplete({ period, time: timeString }), 500);
  };

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour < 10 ? `0${hour}` : `${hour}`;
  });

  // Common minute options
  const minuteOptions = ['00', '15', '30', '45'];

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
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Healthy habits form through consistency
            </h1>
            <p className="text-center text-muted-foreground mb-10">
              When will you make time for your facial fitness?
            </p>
            
            {/* Time of day selection */}
            <div className="grid grid-cols-3 gap-1 mb-8 border border-border rounded-lg overflow-hidden">
              <div 
                className={`flex flex-col items-center justify-center p-4 cursor-pointer transition-colors ${period === 'MORNING' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => setPeriod('MORNING')}
              >
                <SunIcon className="mb-2 h-6 w-6" />
                <span className="text-xs font-semibold tracking-wider">MORNING</span>
                <span className={`mt-4 py-2 px-4 rounded-full text-sm font-medium ${period === 'MORNING' ? 'bg-black text-white' : 'bg-muted'}`}>
                  9:00 AM
                </span>
              </div>
              <div 
                className={`flex flex-col items-center justify-center p-4 cursor-pointer transition-colors ${period === 'DAY' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => setPeriod('DAY')}
              >
                <svg className="mb-2 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3V4M12 20V21M3 12H4M20 12H21M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-semibold tracking-wider">DAY</span>
                <span className={`mt-4 py-2 px-4 rounded-full text-sm font-medium ${period === 'DAY' ? 'bg-black text-white' : 'bg-muted'}`}>
                  2:30 PM
                </span>
              </div>
              <div 
                className={`flex flex-col items-center justify-center p-4 cursor-pointer transition-colors ${period === 'EVENING' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => setPeriod('EVENING')}
              >
                <MoonIcon className="mb-2 h-6 w-6" />
                <span className="text-xs font-semibold tracking-wider">EVENING</span>
                <span className={`mt-4 py-2 px-4 rounded-full text-sm font-medium ${period === 'EVENING' ? 'bg-black text-white' : 'bg-muted'}`}>
                  9:00 PM
                </span>
              </div>
            </div>
            
            {/* Time picker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-muted/50 rounded-xl p-6 mb-8"
            >
              <div className="flex justify-center items-center">
                {/* Hours */}
                <div className="w-1/3 text-center">
                  <div className="relative h-40 overflow-y-auto scrollbar-hide" ref={hourPickerRef}>
                    <div className="flex flex-col items-center py-16">
                      {hourOptions.map((hour) => (
                        <div 
                          key={hour}
                          className={`py-2 cursor-pointer transition-colors ${hours === hour ? 'text-2xl font-bold' : 'text-muted-foreground'}`}
                          onClick={() => setHours(hour)}
                        >
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Separator */}
                <div className="text-2xl font-bold">:</div>
                
                {/* Minutes */}
                <div className="w-1/3 text-center">
                  <div className="relative h-40 overflow-y-auto scrollbar-hide" ref={minutePickerRef}>
                    <div className="flex flex-col items-center py-16">
                      {minuteOptions.map((minute) => (
                        <div 
                          key={minute}
                          className={`py-2 cursor-pointer transition-colors ${minutes === minute ? 'text-2xl font-bold' : 'text-muted-foreground'}`}
                          onClick={() => setMinutes(minute)}
                        >
                          {minute}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* AM/PM */}
                <div className="w-1/3 text-center">
                  <div className="relative h-40 flex flex-col items-center justify-center">
                    <div 
                      className={`py-2 cursor-pointer transition-colors ${amPm === 'AM' ? 'text-2xl font-bold' : 'text-muted-foreground'}`}
                      onClick={() => setAmPm('AM')}
                    >
                      AM
                    </div>
                    <div 
                      className={`py-2 cursor-pointer transition-colors ${amPm === 'PM' ? 'text-2xl font-bold' : 'text-muted-foreground'}`}
                      onClick={() => setAmPm('PM')}
                    >
                      PM
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Selected time highlight */}
              <div className="relative mt-4 text-center">
                <p className="text-lg font-semibold">
                  Selected time: <span className="text-primary">{hours}:{minutes} {amPm}</span>
                </p>
              </div>
            </motion.div>
            
            {/* Done button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleComplete}
                size="lg"
                className="px-12 py-6 text-lg rounded-full h-auto w-full max-w-xs"
              >
                done
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