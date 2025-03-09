import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="py-20 bg-black relative overflow-hidden" id="hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Intro Tag */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-purple-900/50 text-purple-400 text-sm font-medium rounded-full mb-4">
              INTRODUCING
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            A MASSIVE <span className="text-purple-500">UPGRADE</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Join the community that's creating <span className="text-purple-400">real-world success</span> through practical skills and expert mentorship.
          </p>
          
          {/* Video Component */}
          <div className="relative w-full aspect-video max-w-3xl mx-auto mb-10 rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-black/20 z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button 
                className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                aria-label="Play video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <Image 
              src="/images/hero-video-thumbnail.jpg" 
              alt="PropulsionSociety Video" 
              fill
              className="object-cover"
            />
          </div>
          
          {/* CTA Button */}
          <div className="mb-6">
            <Link href="/register" className="btn btn-yellow px-8 py-4 text-lg">
              JOIN THE REAL WORLD
            </Link>
          </div>
          
          {/* Social Proof */}
          <p className="text-gray-400 mb-8">
            Join 113,000+ like-minded students
          </p>
          
          {/* Visual Progression */}
          <div className="flex items-center justify-center space-x-4">
            <div className="px-4 py-2 bg-gray-800 rounded-md text-sm">
              Hustlers University
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="px-4 py-2 bg-purple-900 rounded-md text-sm font-bold">
              THE REAL WORLD
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 