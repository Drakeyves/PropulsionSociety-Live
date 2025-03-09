"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new verification email.');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify email');
        }

        setStatus('success');
        setMessage('Your email has been successfully verified!');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err: any) {
        console.error('Email verification error:', err);
        setStatus('error');
        setMessage(err.message || 'An unexpected error occurred');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Verification</h2>
      
      <div className={`p-4 rounded-md mb-6 ${
        status === 'loading' ? 'bg-blue-50 text-blue-700' :
        status === 'success' ? 'bg-green-50 text-green-700' :
        'bg-red-50 text-red-500'
      }`}>
        {status === 'loading' && (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{message}</span>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <h3 className="text-lg font-medium mb-2">Email Verified</h3>
            <p>{message}</p>
            <p className="text-sm mt-2">Redirecting to login page...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h3 className="text-lg font-medium mb-2">Verification Failed</h3>
            <p>{message}</p>
            <div className="mt-4">
              <Link 
                href="/login" 
                className="text-red-700 font-medium hover:underline"
              >
                Return to login
              </Link>
            </div>
          </>
        )}
      </div>
      
      {status !== 'loading' && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="font-medium text-purple-600 hover:text-purple-500">
              Contact support
            </Link>
          </p>
        </div>
      )}
    </div>
  );
} 