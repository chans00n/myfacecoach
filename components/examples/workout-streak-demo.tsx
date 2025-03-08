"use client";

import { useState } from "react";
import { LiftStreakTracker } from "@/components/ui/workout-streak-tracker";
import { Button } from "@/components/ui/button";
import { addDays, format, subDays } from "date-fns";

export function LiftStreakDemo() {
  // Generate some sample lift dates for the past 6 months
  // with a pattern of lifts (e.g., 3-4 days per week)
  const generateSampleLiftDates = () => {
    const dates: string[] = [];
    const today = new Date();
    
    // Generate a 3-month streak with 3-4 lifts per week
    for (let i = 0; i < 90; i++) {
      const date = subDays(today, i);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Lift on Monday, Wednesday, Friday, and sometimes Saturday
      if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || (dayOfWeek === 6 && Math.random() > 0.5)) {
        dates.push(date.toISOString());
      }
    }
    
    // Add some random lifts in the past 3-6 months
    for (let i = 91; i < 182; i++) {
      const date = subDays(today, i);
      
      // 30% chance of a lift on any given day
      if (Math.random() < 0.3) {
        dates.push(date.toISOString());
      }
    }
    
    return dates;
  };

  const [liftDates, setLiftDates] = useState<string[]>(generateSampleLiftDates());
  
  // Function to simulate completing today's lift
  const completeLift = () => {
    const today = new Date().toISOString();
    if (!liftDates.includes(today)) {
      setLiftDates([...liftDates, today]);
    }
  };
  
  // Function to simulate missing a lift (remove most recent)
  const missLift = () => {
    const newDates = [...liftDates];
    newDates.pop();
    setLiftDates(newDates);
  };

  return (
    <div className="space-y-4">
      <LiftStreakTracker liftDates={liftDates} />
      
      <div className="flex gap-2 justify-center">
        <Button onClick={completeLift}>
          Complete Today's Lift
        </Button>
        <Button variant="outline" onClick={missLift}>
          Remove Last Lift
        </Button>
      </div>
    </div>
  );
} 