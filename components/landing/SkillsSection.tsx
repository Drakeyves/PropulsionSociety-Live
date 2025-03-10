import React from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';

const SkillsSection = () => {
  return (
    <section className="py-20 bg-black" id="skills">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Yellow Coin Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6">NEW SKILLS</h2>
          
          {/* Description */}
          <p className="text-xl text-gray-300 mb-10">
            We're constantly adding new skills and campuses to help you stay ahead in today's rapidly changing economy.
          </p>
          
          {/* Featured Skill */}
          <div className="bg-gray-900/60 rounded-lg p-8 mb-10 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Artificial Intelligence</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Learn how to leverage AI tools to enhance your productivity, create content, and build applications that were previously impossible.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-3 py-1 bg-purple-900/40 rounded-full text-sm">Prompt Engineering</span>
              <span className="px-3 py-1 bg-purple-900/40 rounded-full text-sm">AI Tools</span>
              <span className="px-3 py-1 bg-purple-900/40 rounded-full text-sm">Content Creation</span>
              <span className="px-3 py-1 bg-purple-900/40 rounded-full text-sm">Automation</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="mb-6">
            <Link href="/register" className="btn btn-gold px-8 py-3">
              UNLOCK ALL SKILLS
            </Link>
          </div>
          
          {/* Access Message */}
          <div className="flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Get access to all 10+ Campuses</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 