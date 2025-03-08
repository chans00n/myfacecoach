import { redirect } from 'next/navigation';

export default function TodayLiftRedirect() {
  // Redirect to the workouts/today page
  redirect('/workouts/today');
  
  // This return is never reached but needed for TypeScript
  return null;
} 