import React, { useRef } from 'react';
import Hero from '../components/Hero';
import FeaturedDestinations from '../components/FeaturedDestinations';
import MoodExplorer from '../components/MoodExplorer';
import AIPromptTeaser from '../components/AIPromptTeaser';
import useScrollLinkedReveal from '../hooks/useScrollLinkedReveal';

export default function HomePage({ onOpenAI, onOpenAIWithPrompt }) {
  const homeRef = useRef(null);
  useScrollLinkedReveal(homeRef, []);

  return (
    <div ref={homeRef} className="space-y-0">
      {/* Cinematic Hero with initial entrance + scroll progress parallax */}
      <Hero onOpenAI={onOpenAI} />

      {/* Featured Editorial Destinations with scroll-linked reveal */}
      <FeaturedDestinations />

      {/* Travel Moods with scroll-linked reveal */}
      <MoodExplorer />

      {/* AI Planner Teaser with scroll-linked reveal */}
      <AIPromptTeaser onLaunchAI={onOpenAIWithPrompt} />
    </div>
  );
}
