import React from 'react';
import Link from 'next/link';

interface PricingFeature {
  included: boolean;
  text: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}

const PricingCard = ({ plan }: { plan: PricingPlan }) => (
  <div className={`rounded-xl overflow-hidden ${plan.highlighted ? 'border-2 border-purple-500 transform scale-105' : 'border border-gray-800'}`}>
    <div className={`p-8 ${plan.highlighted ? 'bg-gradient-to-br from-purple-900/40 to-black' : 'bg-gray-900/40'}`}>
      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-4xl font-bold">{plan.price}</span>
        <span className="text-gray-400 ml-2">{plan.period}</span>
      </div>
      <p className="text-gray-300 mb-6">{plan.description}</p>
      
      <Link href={plan.buttonLink} className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors ${plan.highlighted ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
        {plan.buttonText}
      </Link>
    </div>
    
    <div className="bg-black p-8">
      <ul className="space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            <span className={feature.included ? 'text-white' : 'text-gray-500'}>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const PricingSection = () => {
  const pricingPlans: PricingPlan[] = [
    {
      name: "BASIC ACCESS",
      price: "$97",
      period: "/month",
      description: "Perfect for beginners looking to start their journey.",
      features: [
        { included: true, text: "Access to 1 campus of your choice" },
        { included: true, text: "Basic community access" },
        { included: true, text: "Weekly group coaching calls" },
        { included: true, text: "Basic learning materials" },
        { included: false, text: "1-on-1 coaching sessions" },
        { included: false, text: "Advanced masterclasses" },
        { included: false, text: "Networking events" }
      ],
      buttonText: "Get Started",
      buttonLink: "/register"
    },
    {
      name: "PREMIUM ACCESS",
      price: "$197",
      period: "/month",
      description: "Our most popular plan for serious learners.",
      features: [
        { included: true, text: "Access to 3 campuses of your choice" },
        { included: true, text: "Full community access" },
        { included: true, text: "Daily live coaching sessions" },
        { included: true, text: "Complete learning library" },
        { included: true, text: "Monthly 1-on-1 coaching session" },
        { included: true, text: "All masterclasses included" },
        { included: true, text: "Exclusive networking events" }
      ],
      buttonText: "Join Premium",
      buttonLink: "/register-premium",
      highlighted: true
    },
    {
      name: "LIFETIME ACCESS",
      price: "$1,997",
      period: "one-time",
      description: "For committed individuals seeking long-term success.",
      features: [
        { included: true, text: "Lifetime access to ALL campuses" },
        { included: true, text: "VIP community access" },
        { included: true, text: "Unlimited coaching sessions" },
        { included: true, text: "Complete resource library" },
        { included: true, text: "Quarterly 1-on-1 strategy calls" },
        { included: true, text: "Early access to new content" },
        { included: true, text: "Exclusive in-person events" }
      ],
      buttonText: "Get Lifetime Access",
      buttonLink: "/register-lifetime"
    }
  ];

  return (
    <section className="py-20 bg-black" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm text-yellow-500 uppercase tracking-wide mb-2">INVESTMENT</p>
          <h2 className="text-3xl md:text-4xl font-bold">CHOOSE YOUR ACCESS LEVEL</h2>
          <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
            Invest in your future with flexible plans designed to fit your goals and budget.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 max-w-2xl mx-auto">
            All plans include a 7-day money-back guarantee. No questions asked.
            <br />
            Not sure which plan is right for you? <Link href="/contact" className="text-purple-400 hover:text-purple-300">Contact us</Link> for a personalized recommendation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 