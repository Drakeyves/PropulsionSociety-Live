'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';

/**
 * SessionRefresh component that extends the user's session when they are active.
 * This component should be added to the root layout to ensure it's active throughout the application.
 * 
 * It works by:
 * 1. Refreshing the session every 10 minutes automatically
 * 2. Refreshing the session on user activity (clicks and keypresses)
 * 
 * This helps prevent users from being unexpectedly logged out during active sessions.
 */
export default function SessionRefresh() {
  const { update } = useSession();
  
  const refreshSession = useCallback(async () => {
    await update();
  }, [update]);
  
  useEffect(() => {
    // Refresh session every 10 minutes
    const interval = setInterval(refreshSession, 10 * 60 * 1000);
    
    // Also refresh on user activity
    const handleActivity = () => {
      refreshSession();
    };
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [refreshSession]);
  
  // This component doesn't render anything
  return null;
} 