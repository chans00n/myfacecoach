"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays, isSameDay, parseISO } from "date-fns";

interface WorkoutStreakTrackerProps {
  workoutDates: string[]; // Array of ISO date strings when workouts were completed
  className?: string;
}

export function WorkoutStreakTracker({ 
  workoutDates = [], 
  className 
}: WorkoutStreakTrackerProps) {
  // Calculate streak data
  const [streakData, setStreakData] = useState<{
    currentStreak: number;
    longestStreak: number;
    totalWorkouts: number;
    lastSixMonths: { date: Date; completed: boolean }[];
  }>({
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    lastSixMonths: [],
  });

  useEffect(() => {
    // Convert string dates to Date objects
    const workoutDateObjects = workoutDates.map(date => parseISO(date));
    
    // Generate dates for the last 6 months (7 rows x 26 columns = 182 days)
    const today = new Date();
    const lastSixMonths: { date: Date; completed: boolean }[] = [];
    
    for (let i = 0; i < 182; i++) {
      const date = subDays(today, i);
      const completed = workoutDateObjects.some(workoutDate => 
        isSameDay(workoutDate, date)
      );
      
      lastSixMonths.unshift({ date, completed });
    }
    
    // Calculate current streak
    let currentStreak = 0;
    for (let i = lastSixMonths.length - 1; i >= 0; i--) {
      if (lastSixMonths[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (const day of lastSixMonths) {
      if (day.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    setStreakData({
      currentStreak,
      longestStreak,
      totalWorkouts: workoutDates.length,
      lastSixMonths,
    });
  }, [workoutDates]);

  // Split the days into rows (7 rows of 26 days each)
  const rows = [];
  for (let i = 0; i < 7; i++) {
    rows.push(streakData.lastSixMonths.slice(i * 26, (i + 1) * 26));
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Workout Streak</CardTitle>
        <CardDescription>Track your consistency over time</CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Streak visualization */}
        <div className="mb-4">
          <div className="grid grid-rows-7 gap-2">
            {rows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-2">
                {row.map((day, dayIndex) => (
                  <TooltipProvider key={`day-${rowIndex}-${dayIndex}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "w-3 h-3 rounded-sm",
                            day.completed 
                              ? "bg-primary hover:bg-primary/90" 
                              : "bg-muted-foreground/20 hover:bg-muted-foreground/30 dark:bg-muted-foreground/30 dark:hover:bg-muted-foreground/40",
                            "transition-colors duration-200 cursor-pointer"
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{format(day.date, "MMM d, yyyy")}</p>
                        <p className={day.completed ? "text-primary" : "text-muted-foreground"}>
                          {day.completed ? "Workout completed ✓" : "No workout"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-end gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary"></div>
              <span>Workout completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-muted-foreground/20 dark:bg-muted-foreground/30"></div>
              <span>No workout</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">{streakData.currentStreak}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Longest Streak</p>
            <p className="text-2xl font-bold">{streakData.longestStreak}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Workouts</p>
            <p className="text-2xl font-bold">{streakData.totalWorkouts}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 