'use client';

import { supabase } from './supabase';

// Track if we've already initialized the realtime connection
let isRealtimeInitialized = false;

/**
 * Initialize a single realtime connection to Supabase
 * This prevents multiple connections being created
 */
export function initializeRealtimeConnection() {
  if (typeof window === 'undefined' || isRealtimeInitialized) {
    return;
  }

  try {
    // Set up connection parameters with retry logic
    const channel = supabase.channel('global-channel', {
      config: {
        broadcast: { self: true },
        presence: { key: 'user-presence' },
      },
    });

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to Supabase realtime channel');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Error connecting to Supabase realtime channel');
        // Don't retry immediately to prevent connection spam
        setTimeout(() => {
          isRealtimeInitialized = false;
        }, 5000);
      }
    });

    // Mark as initialized
    isRealtimeInitialized = true;
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      channel.unsubscribe();
    });
    
    return channel;
  } catch (error) {
    console.error('Failed to initialize Supabase realtime connection:', error);
    return null;
  }
}

/**
 * Subscribe to a specific table for realtime updates
 * @param tableName The name of the table to subscribe to
 * @param callback The callback to execute when data changes
 */
export function subscribeToTable(tableName: string, callback: (payload: any) => void) {
  try {
    const channel = supabase
      .channel(`table-changes-${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
      
    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
    };
  } catch (error) {
    console.error(`Error subscribing to table ${tableName}:`, error);
    return () => {}; // Return empty function as fallback
  }
} 