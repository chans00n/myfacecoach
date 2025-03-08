"use client";

import React from 'react';
import { generateWeekOfWorkouts } from '@/utils/mockWorkouts';
import DailyWorkoutCard from '@/components/workouts/DailyWorkoutCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Info } from "lucide-react";

export default function WorkoutsPage() {
  // Get all workouts for the week
  const workouts = generateWeekOfWorkouts();
  
  // Group workouts by type (regular vs Texas Cardio)
  const regularWorkouts = workouts.filter(workout => !workout.isTexasCardioDay);
  const texasCardioWorkouts = workouts.filter(workout => workout.isTexasCardioDay);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Facial Fitness Workouts</h1>
          <p className="text-muted-foreground mt-1">
            Your weekly workout schedule based on the MYFC methodology
          </p>
        </div>
        <div className="flex items-center mt-2 md:mt-0 text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-start">
        <Info className="h-5 w-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800">About Your Workout Schedule</h3>
          <p className="text-sm text-blue-700 mt-1">
            Following the MYFC methodology, your weekly schedule includes regular facial fitness workouts and special Texas Cardio days (Tuesday and Friday). 
            Texas Cardio days focus on massage techniques to boost circulation and give your facial muscles a break from lifting.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="regular">Regular Workouts</TabsTrigger>
          <TabsTrigger value="texas-cardio">Texas Cardio Days</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <DailyWorkoutCard
                key={workout.id}
                id={workout.id}
                title={workout.title}
                description={workout.description}
                imageUrl={workout.imageUrl}
                duration={workout.totalDuration}
                date={workout.date}
                level={workout.level}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="regular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularWorkouts.map((workout) => (
              <DailyWorkoutCard
                key={workout.id}
                id={workout.id}
                title={workout.title}
                description={workout.description}
                imageUrl={workout.imageUrl}
                duration={workout.totalDuration}
                date={workout.date}
                level={workout.level}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="texas-cardio">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {texasCardioWorkouts.map((workout) => (
              <DailyWorkoutCard
                key={workout.id}
                id={workout.id}
                title={workout.title}
                description={workout.description}
                imageUrl={workout.imageUrl}
                duration={workout.totalDuration}
                date={workout.date}
                level={workout.level}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 