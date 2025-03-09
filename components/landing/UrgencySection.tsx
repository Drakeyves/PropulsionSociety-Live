import React from 'react';
import Link from 'next/link';

const UrgencySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-900/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            DON'T WAIT TO START <span className="text-yellow-500">WINNING</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Every day you delay is another day of missed opportunities. The most successful people in our community all share one thing in common: they started today, not tomorrow.
          </p>
          
          {/* Countdown Timer */}
          <div className="bg-black/50 rounded-lg p-6 mb-10 inline-block">
            <p className="text-yellow-500 font-medium mb-3">Limited Time Offer Ends In:</p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="bg-gray-900 rounded-lg w-16 h-16 flex items-center justify-center text-3xl font-bold">
                  23
                </div>
                <p className="text-sm mt-1">Hours</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-900 rounded-lg w-16 h-16 flex items-center justify-center text-3xl font-bold">
                  59
                </div>
                <p className="text-sm mt-1">Minutes</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-900 rounded-lg w-16 h-16 flex items-center justify-center text-3xl font-bold">
                  37
                </div>
                <p className="text-sm mt-1">Seconds</p>
              </div>
            </div>
          </div>
          
          {/* Benefits List */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Start Immediately</h3>
              <p className="text-gray-300">
                Get instant access to all materials and start your journey today.
              </p>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bonus Content</h3>
              <p className="text-gray-300">
                Early members receive exclusive bonus materials and resources.
              </p>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Risk-Free Trial</h3>
              <p className="text-gray-300">
                Try the platform with our 7-day money-back guarantee.
              </p>
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="mb-6">
            <Link href="/register" className="btn btn-yellow px-10 py-4 text-lg">
              JOIN NOW
            </Link>
          </div>
          
          <p className="text-gray-400">
            Join 113,000+ members already creating their success stories
          </p>
        </div>
      </div>
    </section>
  );
};

export default UrgencySection; 