'use client';

/**
 * This utility fixes Amplitude initialization issues by ensuring proper event types
 * and preventing multiple initializations.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Function to fix Amplitude issues
export function fixAmplitudeIssues() {
  if (!isBrowser) return;
  
  try {
    // Find the Amplitude object if it exists
    const amplitude = (window as any).amplitude;
    
    if (!amplitude) return;
    
    // Store the original logEvent function
    const originalLogEvent = amplitude.getInstance().logEvent;
    
    // Override the logEvent function to ensure event_type is always valid
    amplitude.getInstance().logEvent = function(eventType: string, eventProperties: any) {
      // Ensure eventType is a non-empty string
      if (!eventType || typeof eventType !== 'string' || eventType.trim() === '') {
        console.warn('Amplitude: Invalid event type provided, using fallback');
        eventType = 'unknown_event';
      }
      
      // Call the original function with the validated event type
      return originalLogEvent.call(this, eventType, eventProperties);
    };
    
    console.log('Amplitude fix applied successfully');
  } catch (error) {
    console.error('Error applying Amplitude fix:', error);
  }
}

// Apply the fix automatically when this module is imported
if (isBrowser) {
  // Wait for the window to load completely
  if (document.readyState === 'complete') {
    fixAmplitudeIssues();
  } else {
    window.addEventListener('load', fixAmplitudeIssues);
  }
} 