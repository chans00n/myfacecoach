"use client";

import { useState } from "react";
import { WorkoutStreakTracker } from "@/components/ui/workout-streak-tracker";
import { Button } from "@/components/ui/button";
import { addDays, format, subDays } from "date-fns";

export function WorkoutStreakDemo() {
  // Generate some sample workout dates for the past 6 months
  // with a pattern of workouts (e.g., 3-4 days per week)
  const generateSampleWorkoutDates = () => {
    const dates: string[] = [];
    const today = new Date();
    
    // Generate a 3-month streak with 3-4 workouts per week
    for (let i = 0; i < 90; i++) {
      const date = subDays(today, i);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Workout on Monday, Wednesday, Friday, and sometimes Saturday
      if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || (dayOfWeek === 6 && Math.random() > 0.5)) {
        dates.push(date.toISOString());
      }
    }
    
    // Add some random workouts in the past 3-6 months
    for (let i = 91; i < 182; i++) {
      const date = subDays(today, i);
      
      // 30% chance of a workout on any given day
      if (Math.random() < 0.3) {
        dates.push(date.toISOString());
      }
    }
    
    return dates;
  };

  const [workoutDates, setWorkoutDates] = useState<string[]>(generateSampleWorkoutDates());
  
  // Function to simulate completing today's workout
  const completeWorkout = () => {
    const today = new Date().toISOString();
    if (!workoutDates.includes(today)) {
      setWorkoutDates([...workoutDates, today]);
    }
  };
  
  // Function to simulate missing a workout (remove most recent)
  const missWorkout = () => {
    const newDates = [...workoutDates];
    newDates.pop();
    setWorkoutDates(newDates);
  };

  return (
    <div className="space-y-4">
      <WorkoutStreakTracker workoutDates={workoutDates} />
      
      <div className="flex gap-2 justify-center">
        <Button onClick={completeWorkout}>
          Complete Today's Workout
        </Button>
        <Button variant="outline" onClick={missWorkout}>
          Remove Last Workout
        </Button>
      </div>
    </div>
  );
} 