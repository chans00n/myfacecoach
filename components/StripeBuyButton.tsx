'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
  className?: string;
}

export function StripeBuyButton({ buyButtonId, publishableKey, className }: StripeBuyButtonProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only load the script if it's not already present
    if (!document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const handleMessage = (event: MessageEvent) => {
      // Accept messages from any Stripe domain
      if (!event.origin.match(/^https:\/\/[^.]+\.stripe\.com$/)) {
        return;
      }
      
      try {
        // Ensure we have data and it's the expected format
        if (event.data && event.data.type === 'buy-button:success') {
          console.log('Payment successful, redirecting...');
          if (event.data.payload && event.data.payload.paymentIntentId) {
            window.localStorage.setItem('stripe_payment_intent', event.data.payload.paymentIntentId);
          }
          router.push('/dashboard/profile?success=true&message=' + encodeURIComponent('Your payment was successful! Your subscription is now active.'));
          router.refresh();
        }
      } catch (error) {
        console.error('Error processing Stripe message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      // Don't remove the script as it might be used by other components
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  useEffect(() => {
    // Debug log to verify Stripe key
    // console.log('Stripe public key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 8) + '...');
  }, []);

  if (!user) return null;

  // Use a more specific success URL with query parameters
  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/dashboard/profile?success=true&message=${encodeURIComponent('Your payment was successful! Your subscription is now active.')}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/dashboard/profile?canceled=true`;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: `
          <stripe-buy-button
            buy-button-id="${buyButtonId}"
            publishable-key="${publishableKey}"
            client-reference-id="${user.id}"
            customer-email="${user.email}"
            success-url="${successUrl}"
            cancel-url="${cancelUrl}"
          >
          </stripe-buy-button>
        `
      }}
    />
  );
} 
