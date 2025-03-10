"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import SkillsSection from '@/components/landing/SkillsSection';
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import AccessSection from '@/components/landing/AccessSection';
import PricingSection from '@/components/landing/PricingSection';
import UrgencySection from '@/components/landing/UrgencySection';
import FAQSection from '@/components/landing/FAQSection';
import FloatingChatButton from '@/components/ui/FloatingChatButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SkillsSection />
      <SuccessStoriesSection />
      <AccessSection />
      <PricingSection />
      <UrgencySection />
      <FAQSection />
      <FloatingChatButton />
    </main>
  );
} 