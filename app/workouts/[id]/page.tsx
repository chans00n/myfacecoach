import React from 'react';
import { LiftDetail } from '@/components/workouts/WorkoutDetail';
import { generateWeekOfWorkouts } from '@/utils/mockWorkouts';
import { notFound } from 'next/navigation';

export default function LiftPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the workout data from an API or database
  // For now, we'll use our mock data
  const workouts = generateWeekOfWorkouts();
  const workout = workouts.find(w => w.id === params.id);
  
  if (!workout) {
    notFound();
  }
  
  return <LiftDetail workout={workout} />;
}

// Generate static params for all workouts in the week
export async function generateStaticParams() {
  const workouts = generateWeekOfWorkouts();
  
  return workouts.map((workout) => ({
    id: workout.id,
  }));
} 