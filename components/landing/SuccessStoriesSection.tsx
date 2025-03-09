import React from 'react';
import Image from 'next/image';

interface SuccessStory {
  avatar: string;
  name: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

const SuccessStoryCard = ({ story }: { story: SuccessStory }) => (
  <div className="bg-gray-900/60 rounded-lg overflow-hidden shadow-xl">
    {/* Header */}
    <div className="p-4 flex items-center">
      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
        <Image 
          src={story.avatar} 
          alt={story.name} 
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="font-medium">{story.name}</h4>
        <p className="text-xs text-gray-400">{story.timestamp}</p>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-4 pt-0">
      <p className="text-gray-300 mb-4">{story.content}</p>
    </div>
    
    {/* Image (if any) */}
    {story.image && (
      <div className="relative w-full aspect-video">
        <Image 
          src={story.image} 
          alt="Success story image" 
          fill
          className="object-cover"
        />
      </div>
    )}
    
    {/* Engagement */}
    <div className="p-4 border-t border-gray-800 flex items-center text-sm text-gray-400">
      <div className="flex items-center mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{story.likes}</span>
      </div>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{story.comments}</span>
      </div>
    </div>
  </div>
);

const SuccessStoriesSection = () => {
  const successStories: SuccessStory[] = [
    {
      avatar: "/images/avatars/user1.jpg",
      name: "Alex Johnson",
      timestamp: "2 days ago",
      content: "Just hit $10K in my first month applying the e-commerce strategies from the Digital Marketing campus! Never thought I'd be able to quit my 9-5 this quickly. Forever grateful to this community! 🚀 #TheRealWorld",
      image: "/images/success/ecommerce-success.jpg",
      likes: 243,
      comments: 57
    },
    {
      avatar: "/images/avatars/user2.jpg",
      name: "Sarah Williams",
      timestamp: "1 week ago",
      content: "After 3 months of consistent effort in the Copywriting campus, I just landed my first $5K client! The templates and feedback from the coaches made all the difference. This is just the beginning!",
      likes: 189,
      comments: 42
    },
    {
      avatar: "/images/avatars/user3.jpg",
      name: "Michael Chen",
      timestamp: "3 days ago",
      content: "My AI app just crossed 1,000 paying users! Everything I learned in the coding campus about building MVPs and finding product-market fit was spot on. Special thanks to @coach_dave for the guidance!",
      image: "/images/success/app-launch.jpg",
      likes: 312,
      comments: 78
    }
  ];

  return (
    <section className="py-20 bg-black/90" id="success">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm text-purple-400 uppercase tracking-wide mb-2">THE REAL WORLD WINS</p>
          <h2 className="text-3xl md:text-4xl font-bold">OUR STUDENTS ARE WINNING</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {successStories.map((story, index) => (
            <SuccessStoryCard key={index} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection; 