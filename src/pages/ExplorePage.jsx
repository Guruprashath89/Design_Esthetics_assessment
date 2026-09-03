import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinationsData';
import DestinationCard from '../components/DestinationCard';
import { Search, Compass, Filter, RefreshCcw } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialRegion = searchParams.get('region') || 'All';
  const initialMood = searchParams.get('mood') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const containerRef = useRef(null);

  useScrollReveal(containerRef, [query, selectedRegion, initialMood]);

  const regions = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  // Sync state with URL params
  useEffect(() => {
    if (searchParams.get('q')) setQuery(searchParams.get('q'));
    if (searchParams.get('region')) setSelectedRegion(searchParams.get('region'));
  }, [searchParams]);

  // Filter logic
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Region check
      const matchRegion =
        selectedRegion === 'All' || d.region.toLowerCase() === selectedRegion.toLowerCase();

      // Search query check
      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));

      // Mood query check
      const matchMood =
        !initialMood || d.tags.some((t) => t.toLowerCase() === initialMood.toLowerCase());

      return matchRegion && matchQuery && matchMood;
    });
  }, [query, selectedRegion, initialMood]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedRegion('All');
    setSearchParams({});
  };

  return (
    <div ref={containerRef} className="pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="reveal space-y-3 sm:space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-aura-terracotta font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Global Explorer</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-aura-sand">
          Explore the world.
        </h1>
        <p className="text-xs sm:text-base text-aura-muted font-sans font-light leading-relaxed">
          Filter our curated dataset of iconic sanctums by region, mood, or custom travel query.
        </p>
      </div>

      {/* Filter Bar & Search Input */}
      <div className="reveal flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 p-3.5 sm:p-4 rounded-2xl bg-aura-card border border-aura-border shadow-card max-w-full overflow-hidden">
        {/* Region Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => {
                setSelectedRegion(reg);
                setSearchParams((prev) => {
                  if (reg === 'All') prev.delete('region');
                  else prev.set('region', reg);
                  return prev;
                });
              }}
              className={`px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 whitespace-nowrap min-h-[36px] ${
                selectedRegion === reg
                  ? 'bg-aura-terracotta text-white shadow-glow'
                  : 'bg-white/5 hover:bg-white/10 text-aura-sand/80 hover:text-aura-sand border border-white/5'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-aura-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, country or tag..."
            className="w-full pl-10 pr-4 py-2.5 bg-aura-dark/80 border border-white/10 rounded-full text-xs text-aura-sand placeholder-aura-muted focus:outline-none focus:border-aura-terracotta/60 min-h-[40px]"
          />
        </div>
      </div>

      {/* Mood filter active banner */}
      {initialMood && (
        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-aura-terracotta/10 border border-aura-terracotta/30 text-xs text-aura-sand">
          <span className="truncate">Filtering by mood: <strong>"{initialMood}"</strong></span>
          <button onClick={handleClearFilters} className="text-aura-terracotta hover:underline font-semibold flex-shrink-0">
            Clear Filter
          </button>
        </div>
      )}

      {/* Destination Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDestinations.map((dest, idx) => (
            <div
              key={dest.id}
              className="reveal-stagger"
              style={{ transitionDelay: `${(idx % 6) * 100}ms` }}
            >
              <DestinationCard destination={dest} layoutVariant="standard" />
            </div>
          ))}
        </div>
      ) : (
        /* Explicit Empty State (#26) */
        <div className="py-16 sm:py-20 text-center space-y-6 max-w-md mx-auto rounded-3xl bg-aura-card/50 border border-aura-border p-6 sm:p-8 animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-full bg-aura-terracotta/20 border border-aura-terracotta flex items-center justify-center text-aura-terracotta">
            <Filter className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl text-aura-sand">No destinations found</h3>
            <p className="text-xs text-aura-muted leading-relaxed">
              We couldn't find any sanctums matching your current search parameters. Try another city, country, or region.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 bg-aura-terracotta hover:bg-aura-terracotta-dark text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-all duration-300 inline-flex items-center gap-2 min-h-[40px]"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
