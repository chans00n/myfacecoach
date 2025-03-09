'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectionScreenProps {
  onComplete: (timePreference: { time: string }) => void;
}

export function TimeSelectionScreen({ onComplete }: TimeSelectionScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hours, setHours] = useState<string>('09');
  const [minutes, setMinutes] = useState<string>('00');
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM');

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour < 10 ? `0${hour}` : `${hour}`;
  });

  // Generate minute options (00-55 in 5-minute increments)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5;
    return minute < 10 ? `0${minute}` : `${minute}`;
  });

  const handleComplete = () => {
    setIsVisible(false);
    // Format the time string
    const timeString = `${hours}:${minutes} ${amPm}`;
    // Delay the onComplete callback to allow the exit animation to finish
    setTimeout(() => onComplete({ time: timeString }), 500);
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
            
            {/* Time picker card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-xl p-6 mb-10 border border-border shadow-sm"
            >
              <div className="flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Set your daily reminder</h2>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                {/* Hour selector */}
                <Select
                  value={hours}
                  onValueChange={setHours}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map(hour => (
                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="text-xl font-bold">:</span>
                
                {/* Minute selector */}
                <Select
                  value={minutes}
                  onValueChange={setMinutes}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map(minute => (
                      <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* AM/PM selector */}
                <Select
                  value={amPm}
                  onValueChange={(value) => setAmPm(value as 'AM' | 'PM')}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-center text-muted-foreground">
                <p>We'll send you a notification at this time every day to remind you about your facial fitness routine.</p>
              </div>
            </motion.div>
            
            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleComplete}
                size="lg"
                className="px-12 py-6 text-lg rounded-full h-auto w-full max-w-xs"
              >
                Continue
              </Button>
            </motion.div>
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