"use client";

import { useState } from "react";
import { WorkoutGallery, WorkoutSession, Exercise } from "@/components/ui/workout-gallery";

const INITIAL_WORKOUTS: WorkoutSession[] = [
  {
    id: "1",
    date: "Today",
    title: "Upper Face Lift",
    duration: "45 min",
    calories: "320",
    completed: false,
    imageUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
    brief: "Focus on strengthening and toning the upper facial muscles for a more lifted appearance.",
    exercises: [
      { id: "e1", name: "Forehead Lifter", sets: 3, reps: 10, weight: "30s", isCompleted: false },
      { id: "e2", name: "Brow Raiser", sets: 3, reps: 12, weight: "20s", isCompleted: false },
      { id: "e3", name: "Eye Area Toner", sets: 3, reps: 15, weight: "15s", isCompleted: false },
    ]
  },
  {
    id: "2",
    date: "Yesterday",
    title: "Lower Face Lift",
    duration: "50 min",
    calories: "450",
    completed: true,
    imageUrl: "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg",
    brief: "Target the jawline and neck muscles to define and sculpt the lower face region.",
    exercises: [
      { id: "e4", name: "Jawline Definer", sets: 4, reps: 12, weight: "25s", isCompleted: true },
      { id: "e5", name: "Neck Toner", sets: 3, reps: 8, weight: "30s", isCompleted: true },
      { id: "e6", name: "Chin Lift", sets: 3, reps: 15, weight: "20s", isCompleted: true },
    ]
  },
  {
    id: "3",
    date: "Tomorrow",
    title: "Texas Cardio Day",
    duration: "30 min",
    calories: "380",
    completed: false,
    imageUrl: "/images/chad-madden-1z6JYPafvII-unsplash.jpg",
    brief: "High-intensity massage techniques to boost circulation and give your facial muscles a break from lifting.",
    exercises: [
      { id: "e7", name: "Deep Facial Massage", sets: 3, reps: 20, isCompleted: false },
      { id: "e8", name: "Lymphatic Drainage", sets: 3, reps: 30, isCompleted: false },
      { id: "e9", name: "Pressure Point Therapy", sets: 3, reps: 15, isCompleted: false },
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
    console.log("Viewing details for lift:", workoutId);
    // You can implement navigation to a detailed view here
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <WorkoutGallery
          title="Weekly Lift Plan"
          description="Track your facial fitness journey"
          workouts={workouts}
          onToggleExercise={handleToggleExercise}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
} 