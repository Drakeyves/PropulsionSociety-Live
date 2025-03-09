import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQAccordionItem = ({ faq, isOpen, toggleOpen }: { 
  faq: FAQItem; 
  isOpen: boolean; 
  toggleOpen: () => void;
}) => {
  return (
    <div className="border-b border-gray-800">
      <button
        className="flex justify-between items-center w-full py-5 px-4 text-left focus:outline-none"
        onClick={toggleOpen}
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        <span className="text-lg font-medium">{faq.question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <div className="px-4 text-gray-300" dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs: FAQItem[] = [
    {
      question: "How is this different from traditional education?",
      answer: "Unlike traditional education that focuses on theory, we provide <strong>practical, real-world skills</strong> taught by successful entrepreneurs who have actually built profitable businesses. Our curriculum is constantly updated to match current market demands, and you'll be implementing what you learn in real-time through practical assignments."
    },
    {
      question: "Do I need any prior experience to join?",
      answer: "No prior experience is necessary. Our programs are designed to take you from complete beginner to proficient in your chosen field. We provide step-by-step guidance and support throughout your journey, making complex skills accessible to everyone regardless of background."
    },
    {
      question: "How much time do I need to commit each week?",
      answer: "For optimal results, we recommend dedicating at least <strong>10-15 hours per week</strong> to your learning and implementation. However, our platform is flexible, allowing you to learn at your own pace. Many of our most successful students started with just 5-7 hours per week while working full-time jobs."
    },
    {
      question: "Can I switch between different campuses?",
      answer: "Yes! Depending on your membership level, you can access multiple campuses and switch between them as your interests evolve. Our Premium and Lifetime members can access multiple campuses simultaneously, allowing you to develop complementary skills that enhance your overall success."
    },
    {
      question: "What kind of support will I receive?",
      answer: "You'll receive <strong>comprehensive support</strong> through daily live coaching sessions, our active community forums, dedicated mentors, and regular feedback on your work. We've created a supportive environment where no question goes unanswered and you're never left to figure things out alone."
    },
    {
      question: "What if I'm not satisfied with the program?",
      answer: "We offer a <strong>7-day money-back guarantee</strong> on all our plans. If you feel the program isn't the right fit for you within your first week, simply let us know and we'll process your refund with no questions asked. We're confident in the value we provide, which is why we can offer this guarantee."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-black" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
            Everything you need to know about joining our community and accelerating your success.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-gray-900/30 rounded-xl overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQAccordionItem 
              key={index} 
              faq={faq} 
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400">
            Still have questions? We're here to help.
          </p>
          <a 
            href="/contact" 
            className="inline-block mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 