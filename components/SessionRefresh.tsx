'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useCallback, useRef } from 'react';

/**
 * SessionRefresh component that extends the user's session when they are active.
 * This component should be added to the root layout to ensure it's active throughout the application.
 * 
 * It works by:
 * 1. Refreshing the session every 10 minutes automatically
 * 2. Refreshing the session on user activity (clicks and keypresses) with debouncing
 * 
 * This helps prevent users from being unexpectedly logged out during active sessions
 * while avoiding excessive API calls.
 */
export default function SessionRefresh() {
  const { update } = useSession();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const refreshSession = useCallback(async () => {
    try {
      await update();
      console.log('Session refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  }, [update]);
  
  // Debounced refresh function to prevent excessive API calls
  const debouncedRefresh = useCallback(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      refreshSession();
      debounceTimerRef.current = null;
    }, 5000); // 5 second debounce
  }, [refreshSession]);
  
  useEffect(() => {
    // Refresh session every 10 minutes
    const interval = setInterval(refreshSession, 10 * 60 * 1000);
    
    // Also refresh on user activity with debouncing
    const handleActivity = () => {
      debouncedRefresh();
    };
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    
    // Initial session refresh on component mount
    refreshSession();
    
    return () => {
      clearInterval(interval);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [refreshSession, debouncedRefresh]);
  
  // This component doesn't render anything
  return null;
} 