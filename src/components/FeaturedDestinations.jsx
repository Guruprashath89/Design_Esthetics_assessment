import React, { useRef } from 'react';
import { DESTINATIONS } from '../data/destinationsData';
import DestinationCard from './DestinationCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useScrollLinkedReveal from '../hooks/useScrollLinkedReveal';

export default function FeaturedDestinations() {
  const heroDest = DESTINATIONS[0]; // Kyoto
  const secondaryDests = DESTINATIONS.slice(1, 7);
  const sectionRef = useRef(null);

  useScrollLinkedReveal(sectionRef, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="scroll-linked flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-aura-terracotta font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Destinations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-aura-sand leading-tight">
            Remarkable corners of the world.
          </h2>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-aura-sand hover:text-aura-terracotta transition-colors group font-semibold min-h-[36px]"
        >
          <span>View All 21 Destinations</span>
          <ArrowRight className="w-4 h-4 text-aura-terracotta group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Editorial Grid: Asymmetrical */}
      <div className="space-y-8">
        {/* Large Hero Featured Card */}
        <div className="scroll-linked">
          <DestinationCard destination={heroDest} layoutVariant="hero-large" />
        </div>

        {/* 3 Columns Sub-grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {secondaryDests.map((dest, idx) => (
            <div
              key={dest.id}
              className="scroll-linked-stagger"
              data-stagger-index={idx % 3}
            >
              <DestinationCard destination={dest} layoutVariant="standard" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
