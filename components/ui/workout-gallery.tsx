"use client";

import { Calendar, ArrowUpRight, ChevronRight, ChevronLeft, Clock, Flame, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  title = "Daily Lifts",
  description = "Track your facial fitness progress",
  workouts = [],
  onViewDetails,
  onToggleExercise,
  className
}: WorkoutGalleryProps) {
  const [activeWorkout, setActiveWorkout] = useState<string>(workouts[0]?.id || "");
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const handleExerciseToggle = (workoutId: string, exerciseId: string) => {
    onToggleExercise?.(workoutId, exerciseId);
  };

  const currentWorkout = workouts.find(workout => workout.id === activeWorkout);

  return (
    <div
      className={cn(
        "relative h-full",
        "bg-background",
        "transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Lift Carousel */}
      <div className="mb-6 relative">
        <Carousel className="w-full" opts={{ align: isMobile ? "start" : "center", containScroll: "trimSnaps" }}>
          {/* Custom navigation controls - positioned based on screen size */}
          <div className={cn(
            "flex items-center gap-2 z-10",
            "mb-4 md:absolute md:right-0 md:-top-12"
          )}>
            <CarouselPrevious className="static h-8 w-8 translate-x-0 translate-y-0 bg-background border-border" />
            <CarouselNext className="static h-8 w-8 translate-x-0 translate-y-0 bg-background border-border" />
          </div>
          
          <CarouselContent className="-ml-2 md:-ml-4">
            {workouts.map((workout) => (
              <CarouselItem 
                key={workout.id} 
                className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
              >
                <div 
                  className={cn(
                    "p-4 rounded-xl overflow-hidden group",
                    "border border-border",
                    "relative",
                    workout.id === activeWorkout 
                      ? "bg-primary/10 border-primary/50" 
                      : "bg-card hover:bg-card/80",
                    "transition-all duration-300"
                  )}
                >
                  {/* Card content that selects the workout */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => setActiveWorkout(workout.id)}
                  >
                    {/* Lift Image with AspectRatio */}
                    {workout.imageUrl && (
                      <div className="rounded-lg overflow-hidden mb-3">
                        <AspectRatio ratio={16 / 9} className="bg-muted">
                          <div className="relative w-full h-full">
                            <Image
                              src={workout.imageUrl}
                              alt={workout.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            {workout.completed && (
                              <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Completed
                              </div>
                            )}
                          </div>
                        </AspectRatio>
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
                    
                    {/* Lift Brief */}
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
                  
                  {/* Prominent View Details Button */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={() => onViewDetails?.(workout.id)}
                    >
                      View Lift Details
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Lift Details */}
      {currentWorkout && (
        <div className="space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Exercises</h4>
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