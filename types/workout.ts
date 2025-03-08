import { WorkoutLevel } from "@/components/workouts/DailyWorkoutCard";

// Exercise types based on the MYFC Methodology
export type ExerciseType = 
  | 'lymph-drainage' // Warm-up
  | 'massage'        // Warm-up or cardio
  | 'lift'           // Main workout
  | 'stretch'        // Cool-down
  | 'acupressure';   // Alternative approach

// Exercise categories based on the MYFC Methodology
export type ExerciseCategory = 
  | 'warm-up'
  | 'main-workout'
  | 'cool-down'
  | 'texas-cardio'; // Special massage-focused days

// Facial areas based on the MYFC Methodology
export type FacialArea = 
  | 'forehead'
  | 'brows'
  | 'eyes'
  | 'cheeks'
  | 'neck'
  | 'jawline'
  | 'lips'
  | 'ears'
  | 'full-face'
  | 'facial-core';

// Single exercise definition
export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  category: ExerciseCategory;
  targetArea: FacialArea[];
  duration: number; // in seconds
  repetitions?: number;
  sets?: number;
  imageUrl?: string;
  videoUrl?: string;
  instructions: string[];
  tips?: string[];
  contraindications?: string[];
}

// Workout section (warm-up, main-workout, cool-down)
export interface WorkoutSection {
  title: string;
  description?: string;
  exercises: Exercise[];
  duration: number; // in minutes, calculated from exercises
}

// Complete workout definition
export interface Workout {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
  level: WorkoutLevel;
  isTexasCardioDay: boolean;
  totalDuration: number; // in minutes
  sections: {
    warmUp: WorkoutSection;
    mainWorkout: WorkoutSection;
    coolDown: WorkoutSection;
  };
  notes?: string;
  benefits?: string[];
}

// Mock data for testing
export const WORKOUT_LEVELS: WorkoutLevel[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]; 