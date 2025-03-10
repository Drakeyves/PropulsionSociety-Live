'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * NextAuthProvider component that wraps the application with the NextAuth SessionProvider.
 * This is required for the useSession hook to work properly in client components.
 */
export function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
} 