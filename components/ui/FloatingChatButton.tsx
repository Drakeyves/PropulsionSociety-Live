"use client";

import React, { useState } from 'react';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 rounded-lg shadow-xl mb-4 w-80 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <h3 className="font-medium text-white">Chat with Support</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="p-4 h-80 overflow-y-auto">
            <div className="flex flex-col space-y-3">
              <div className="flex items-start">
                <div className="bg-purple-600 text-white rounded-lg py-2 px-3 max-w-xs">
                  <p>👋 Hi there! How can I help you today?</p>
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-gray-700 text-white rounded-lg py-2 px-3 max-w-xs">
                  <p>I have a question about the pricing plans.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-600 text-white rounded-lg py-2 px-3 max-w-xs">
                  <p>Of course! We offer three plans: Basic ($97/mo), Premium ($197/mo), and Lifetime ($1,997 one-time). What would you like to know about them?</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-gray-800 border-none rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button 
                className="ml-2 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-colors"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FloatingChatButton; 