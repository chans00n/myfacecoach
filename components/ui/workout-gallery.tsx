"use client";

import { Dumbbell, Calendar, ArrowUpRight, ChevronRight, ChevronLeft, Clock, Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export interface WorkoutSession {
  id: string;
  date: string;
  title: string;
  duration: string;
  calories: string;
  exercises: Exercise[];
  completed: boolean;
  imageUrl?: string; // Image URL for the workout
  brief?: string; // Brief description of the workout
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: string;
  isCompleted: boolean;
}

interface WorkoutGalleryProps {
  title?: string;
  description?: string;
  workouts: WorkoutSession[];
  onViewDetails?: (workoutId: string) => void;
  onToggleExercise?: (workoutId: string, exerciseId: string) => void;
  className?: string;
}

export function WorkoutGallery({
  title = "Daily Workouts",
  description = "Track your fitness progress",
  workouts = [],
  onViewDetails,
  onToggleExercise,
  className
}: WorkoutGalleryProps) {
  const [activeWorkout, setActiveWorkout] = useState<string>(workouts[0]?.id || "");
  
  const handleExerciseToggle = (workoutId: string, exerciseId: string) => {
    onToggleExercise?.(workoutId, exerciseId);
  };

  const currentWorkout = workouts.find(workout => workout.id === activeWorkout);

  return (
    <div
      className={cn(
        "relative h-full rounded-3xl p-6",
        "bg-background",
        "border border-border",
        "hover:border-border/80",
        "transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-muted">
          <Dumbbell className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Workout Carousel */}
      <div className="mb-6">
        <Carousel className="w-full">
          <CarouselContent>
            {workouts.map((workout) => (
              <CarouselItem key={workout.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                <div 
                  className={cn(
                    "p-4 rounded-xl cursor-pointer overflow-hidden",
                    "border border-border",
                    workout.id === activeWorkout 
                      ? "bg-primary/10 border-primary/50" 
                      : "bg-card hover:bg-card/80",
                    "transition-colors"
                  )}
                  onClick={() => setActiveWorkout(workout.id)}
                >
                  {/* Workout Image */}
                  {workout.imageUrl && (
                    <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={workout.imageUrl}
                        alt={workout.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      {workout.completed && (
                        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">{workout.date}</span>
                    </div>
                    {!workout.imageUrl && workout.completed && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-medium text-foreground">{workout.title}</h4>
                  
                  {/* Workout Brief */}
                  {workout.brief && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {workout.brief}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{workout.duration}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{workout.calories} cal</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-background border-border" />
          <CarouselNext className="right-2 bg-background border-border" />
        </Carousel>
      </div>

      {/* Workout Details */}
      {currentWorkout && (
        <div className="space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Exercises</h4>
            <button
              onClick={() => onViewDetails?.(currentWorkout.id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View Details
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {currentWorkout.exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseToggle(currentWorkout.id, exercise.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl",
                  "bg-muted/50",
                  "border border-border/50",
                  "hover:border-border",
                  "transition-all"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    exercise.isCompleted 
                      ? "border-primary bg-primary/10" 
                      : "border-muted-foreground"
                  )}>
                    {exercise.isCompleted && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm text-left",
                      exercise.isCompleted
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    )}
                  >
                    {exercise.name}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.weight && ` • ${exercise.weight}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 