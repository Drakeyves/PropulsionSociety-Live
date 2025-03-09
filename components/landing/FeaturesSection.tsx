import React from 'react';
import Image from 'next/image';

const FeatureItem = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mb-10">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full border-2 border-purple-500 flex items-center justify-center mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <ul className="space-y-3 pl-16">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      title: "LEARN VITAL LIFE LESSONS",
      items: [
        "Access <span class='text-purple-400'>step-by-step courses</span> taught by real experts",
        "Learn skills that actually make money in today's economy",
        "Get direct feedback on your progress from mentors",
        "Follow proven systems with measurable results"
      ]
    },
    {
      title: "JOIN A PRIVATE NETWORK",
      items: [
        "Connect with <span class='text-purple-400'>like-minded individuals</span> worldwide",
        "Form partnerships and collaborations with other members",
        "Share resources and opportunities within the community",
        "Build relationships that extend beyond the platform"
      ]
    },
    {
      title: "ACCESS TO MULTIMILLIONAIRES",
      items: [
        "Learn directly from <span class='text-purple-400'>successful entrepreneurs</span>",
        "Get insights that aren't taught in traditional education",
        "Understand the mindset required for exceptional success",
        "Apply proven strategies from those who've already succeeded"
      ]
    }
  ];

  return (
    <section className="py-20 bg-black/80" id="features">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Device Mockups */}
          <div className="relative h-[600px]">
            <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-gradient-to-br from-purple-900/20 to-transparent rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/dashboard-mockup.jpg" 
                alt="PropulsionSociety Dashboard" 
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tr from-purple-900/20 to-transparent rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/mobile-mockup.jpg" 
                alt="PropulsionSociety Mobile App" 
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-12">
            {features.map((feature, index) => (
              <FeatureItem 
                key={index}
                title={feature.title}
                items={feature.items}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 