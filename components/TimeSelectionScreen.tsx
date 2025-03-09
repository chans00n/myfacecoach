'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  // Generate minute options (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    return i < 10 ? `0${i}` : `${i}`;
  });

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
          {/* Notification-like header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mb-10 bg-muted/50 rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="bg-black text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                S.
              </div>
              <div className="text-lg font-semibold text-muted-foreground">STOIC</div>
              <div className="ml-auto text-sm text-muted-foreground">now</div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold">Let's start your day 🌻</p>
              <p className="text-muted-foreground">Your facial fitness routine is waiting for you.</p>
            </div>
          </motion.div>
          
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
              className="bg-muted/50 rounded-xl p-4 mb-8"
            >
              <div className="flex justify-center items-center">
                {/* Hours */}
                <div className="w-1/3 text-center">
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {hourOptions.map((hour, index) => (
                        <div 
                          key={hour}
                          className={`py-2 ${hours === hour ? 'text-2xl font-bold' : 'text-muted-foreground text-opacity-50'}`}
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
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {['00', '15', '30', '45', '59'].map((minute) => (
                        <div 
                          key={minute}
                          className={`py-2 ${minutes === minute ? 'text-2xl font-bold' : 'text-muted-foreground text-opacity-50'}`}
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
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div 
                        className={`py-2 ${amPm === 'AM' ? 'text-2xl font-bold' : 'text-muted-foreground text-opacity-50'}`}
                        onClick={() => setAmPm('AM')}
                      >
                        AM
                      </div>
                      <div 
                        className={`py-2 ${amPm === 'PM' ? 'text-2xl font-bold' : 'text-muted-foreground text-opacity-50'}`}
                        onClick={() => setAmPm('PM')}
                      >
                        PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Selected time highlight */}
              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-muted rounded-md"></div>
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