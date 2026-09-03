import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRAVEL_MOODS } from '../data/destinationsData';
import { Compass, ArrowUpRight } from 'lucide-react';
import useScrollLinkedReveal from '../hooks/useScrollLinkedReveal';

function MoodCardItem({ mood, idx }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => navigate(`/explore?mood=${encodeURIComponent(mood.tag)}`)}
      className="scroll-linked-stagger group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer border border-aura-border hover:border-aura-terracotta/50 transition-all duration-500 shadow-card bg-aura-card"
      data-stagger-index={idx % 4}
    >
      {!imgError ? (
        <img
          src={mood.image}
          alt={mood.title}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-aura-card-hover via-aura-card to-aura-dark flex items-center justify-center p-6 text-center">
          <Compass className="w-12 h-12 text-aura-terracotta/30" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-aura-dark via-aura-dark/40 to-transparent" />

      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end z-10 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl sm:text-2xl text-aura-sand group-hover:text-aura-terracotta transition-colors">
            {mood.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-aura-terracotta opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <p className="text-xs text-aura-sand/70 font-sans font-light leading-relaxed">
          {mood.subtitle}
        </p>
      </div>
    </div>
  );
}

export default function MoodExplorer() {
  const sectionRef = useRef(null);
  useScrollLinkedReveal(sectionRef, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-aura-card/40 border-y border-aura-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="scroll-linked text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-aura-terracotta font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover By Vibe</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-aura-sand">
            Travel by mood.
          </h2>
          <p className="text-xs sm:text-sm text-aura-muted font-sans font-light">
            Filter global sanctums according to the pace and atmosphere your spirit seeks right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAVEL_MOODS.map((mood, idx) => (
            <MoodCardItem key={mood.id} mood={mood} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
