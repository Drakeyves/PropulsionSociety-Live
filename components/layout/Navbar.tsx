import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-background/90 sticky top-0 z-50 border-b border-metallic/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
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

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-metallic hover:text-white">Features</Link>
          <Link href="#interviews" className="text-metallic hover:text-white">Interviews</Link>
          <Link href="#success" className="text-metallic hover:text-white">Student Wins</Link>
          <Link href="#courses" className="text-metallic hover:text-white">Courses</Link>
          <Link href="#about" className="text-metallic hover:text-white">About</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="btn btn-secondary">
            Log in
          </Link>
          <Link href="/register" className="btn btn-primary">
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 