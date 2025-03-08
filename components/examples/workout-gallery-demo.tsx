"use client";

import { useState } from "react";
import { WorkoutGallery, WorkoutSession, Exercise } from "@/components/ui/workout-gallery";

const INITIAL_WORKOUTS: WorkoutSession[] = [
  {
    id: "1",
    date: "Today",
    title: "Upper Body Strength",
    duration: "45 min",
    calories: "320",
    completed: false,
    exercises: [
      { id: "e1", name: "Bench Press", sets: 3, reps: 10, weight: "135 lbs", isCompleted: false },
      { id: "e2", name: "Shoulder Press", sets: 3, reps: 12, weight: "95 lbs", isCompleted: false },
      { id: "e3", name: "Tricep Extensions", sets: 3, reps: 15, weight: "50 lbs", isCompleted: false },
    ]
  },
  {
    id: "2",
    date: "Yesterday",
    title: "Lower Body Focus",
    duration: "50 min",
    calories: "450",
    completed: true,
    exercises: [
      { id: "e4", name: "Squats", sets: 4, reps: 12, weight: "185 lbs", isCompleted: true },
      { id: "e5", name: "Deadlifts", sets: 3, reps: 8, weight: "225 lbs", isCompleted: true },
      { id: "e6", name: "Leg Press", sets: 3, reps: 15, weight: "270 lbs", isCompleted: true },
    ]
  },
  {
    id: "3",
    date: "Tomorrow",
    title: "HIIT Cardio",
    duration: "30 min",
    calories: "380",
    completed: false,
    exercises: [
      { id: "e7", name: "Burpees", sets: 3, reps: 20, isCompleted: false },
      { id: "e8", name: "Mountain Climbers", sets: 3, reps: 30, isCompleted: false },
      { id: "e9", name: "Jump Squats", sets: 3, reps: 15, isCompleted: false },
    ]
  }
];

export function WorkoutGalleryDemo() {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(INITIAL_WORKOUTS);

  const handleToggleExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === workoutId 
        ? {
            ...workout,
            exercises: workout.exercises.map(exercise => 
              exercise.id === exerciseId 
                ? { ...exercise, isCompleted: !exercise.isCompleted }
                : exercise
            )
          }
        : workout
    ));
  };

  const handleViewDetails = (workoutId: string) => {
    console.log("Viewing details for workout:", workoutId);
    // You can implement navigation to a detailed view here
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <WorkoutGallery
          workouts={workouts}
          onToggleExercise={handleToggleExercise}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
} 