import React from 'react';
import WorkoutDetail from '@/components/workouts/WorkoutDetail';
import { getTodayWorkout } from '@/utils/mockWorkouts';

export default function TodayWorkoutPage() {
  // Get today's workout
  const workout = getTodayWorkout();
  
  return <WorkoutDetail workout={workout} />;
} 