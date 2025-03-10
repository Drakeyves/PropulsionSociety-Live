import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PropulsionSocietyLive',
  description: 'A Next.js SaaS platform with authentication, messaging, posting, and group creation features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`${inter.className} bg-background text-white`}>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#141421',
              color: '#fff',
              border: '1px solid rgba(161, 161, 181, 0.2)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
} 