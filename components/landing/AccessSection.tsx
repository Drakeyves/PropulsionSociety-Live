import React from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface AccessFeature {
  title: string;
  description: string;
  features: string[];
  image: string;
}

const AccessFeatureCard = ({ feature }: { feature: AccessFeature }) => (
  <div className="bg-gray-900/40 rounded-lg p-6 shadow-xl">
    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
    <p className="text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: feature.description }}></p>
    
    <ul className="space-y-3 mb-8">
      {feature.features.map((item, index) => (
        <li key={index} className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
    
    <div className="relative w-full h-48 rounded-lg overflow-hidden">
      <OptimizedImage 
        src={feature.image} 
        alt={feature.title} 
        fill
        className="object-cover"
        showLoadingPlaceholder
      />
    </div>
  </div>
);

const AccessSection = () => {
  const accessFeatures: AccessFeature[] = [
    {
      title: "STEP-BY-STEP LEARNING",
      description: "Follow <span class='text-purple-400'>proven systems</span> that break down complex skills into manageable steps.",
      features: [
        "Structured curriculum designed by experts",
        "Practical assignments with real-world application",
        "Progress tracking and achievement milestones",
        "Comprehensive resources and templates"
      ],
      image: "/images/access/learning-platform.jpg"
    },
    {
      title: "DAILY LIVE SESSIONS WITH MILLIONAIRE COACHES",
      description: "Learn directly from <span class='text-purple-400'>successful entrepreneurs</span> who have achieved what you're working toward.",
      features: [
        "Interactive Q&A with industry experts",
        "Real-time feedback on your work",
        "Insider strategies not taught elsewhere",
        "Networking opportunities with successful mentors"
      ],
      image: "/images/access/live-coaching.jpg"
    },
    {
      title: "EXCLUSIVE COMMUNITY",
      description: "Connect with a global network of <span class='text-purple-400'>like-minded individuals</span> all working toward similar goals.",
      features: [
        "Private forums for collaboration and support",
        "Accountability partners and mastermind groups",
        "Exclusive events and networking opportunities",
        "Resource sharing and partnership formation"
      ],
      image: "/images/access/community.jpg"
    }
  ];

  return (
    <section className="py-20 bg-black" id="access">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">YOU WILL GET ACCESS TO</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {accessFeatures.map((feature, index) => (
            <AccessFeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessSection; 