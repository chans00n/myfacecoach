import { redirect } from 'next/navigation';

export default function LiftRedirect({ params }: { params: { id: string } }) {
  // Redirect to the corresponding workout page
  redirect(`/workouts/${params.id}`);
  
  // This return is never reached but needed for TypeScript
  return null;
} 