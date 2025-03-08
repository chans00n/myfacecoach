import React from 'react';
import { LiftDetail } from '@/components/workouts/WorkoutDetail';
import { getTodayWorkout } from '@/utils/mockWorkouts';

export default function TodayLiftPage() {
  // Get today's workout
  const workout = getTodayWorkout();
  
  return <LiftDetail workout={workout} />;
} 