import React, { useState, useRef } from 'react';
import { MapPin, Compass, Landmark } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

function FamousPlaceCardItem({ place, idx }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="reveal-stagger group relative rounded-2xl overflow-hidden bg-aura-card border border-aura-border hover:border-aura-terracotta/40 transition-all duration-500 shadow-card flex flex-col h-[390px] sm:h-[400px]"
      style={{ transitionDelay: `${idx * 100}ms` }}
    >
      {/* Dynamic Photo or Editorial Intentional Fallback */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-aura-card-hover flex-shrink-0">
        {!imgError ? (
          <img
            src={place.image}
            alt={place.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          /* Editorial Intentional Fallback Placeholder */
          <div className="w-full h-full bg-gradient-to-br from-aura-card-hover via-aura-card to-aura-dark flex flex-col items-center justify-center p-6 text-center space-y-2 border-b border-aura-border/40">
            <div className="w-10 h-10 rounded-full bg-aura-terracotta/15 border border-aura-terracotta/30 flex items-center justify-center text-aura-terracotta">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-aura-terracotta font-semibold">
              {place.category || 'Notable Landmark'}
            </span>
            <span className="font-serif text-sm text-aura-sand font-medium line-clamp-1">
              {place.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 card-image-gradient pointer-events-none" />

        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-aura-dark/80 backdrop-blur-md text-aura-sand border border-white/10 font-medium">
            {place.category}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="font-serif text-lg sm:text-xl text-aura-sand group-hover:text-aura-terracotta transition-colors">
            {place.name}
          </h3>
          <p className="text-xs text-aura-muted font-sans font-light leading-relaxed line-clamp-3">
            {place.description}
          </p>
        </div>

        <div className="pt-3 border-t border-aura-border/40 flex items-center justify-between text-[11px] text-aura-muted">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-aura-terracotta flex-shrink-0" />
            <span className="truncate">{place.locationNote}</span>
          </div>
          <span className="font-serif italic text-aura-sand/80 flex-shrink-0">Explore Landmark</span>
        </div>
      </div>
    </div>
  );
}

export default function FamousPlacesGrid({ famousPlaces = [], destinationCity }) {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, []);

  if (!famousPlaces || famousPlaces.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 space-y-6 sm:space-y-8 scroll-mt-24">
      <div className="reveal space-y-1.5 sm:space-y-2">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-aura-terracotta font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Notable Landmarks</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-aura-sand">
          Worth the detour in {destinationCity}.
        </h2>
        <p className="text-xs sm:text-sm text-aura-muted font-sans font-light">
          Essential architectural, natural, and spiritual sanctums defined by historical atmosphere.
        </p>
      </div>

      {/* Visual Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {famousPlaces.map((place, idx) => (
          <FamousPlaceCardItem key={place.id} place={place} idx={idx} />
        ))}
      </div>
    </section>
  );
}
