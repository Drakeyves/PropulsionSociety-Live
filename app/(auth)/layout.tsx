"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="bg-black text-white w-full md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image 
                src="/images/coin-icon.svg" 
                alt="PropulsionSociety Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold">PropulsionSociety</span>
          </Link>
          
          <div className="mt-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join the community that's creating <span className="text-purple-400">real-world success</span></h1>
            <p className="text-gray-400 text-lg">Access expert mentorship, practical skills, and a supportive network to accelerate your growth.</p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-300">Join 113,000+ like-minded students</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-300">7-day money-back guarantee</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth Form */}
      <div className="bg-white w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
} 