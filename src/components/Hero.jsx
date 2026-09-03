import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Navigation, Sparkles, MapPin, ChevronDown } from 'lucide-react';
import { DESTINATIONS } from '../data/destinationsData';
import { getCurrentUserLocation } from '../services/locationService';

export default function Hero({ onOpenAI }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [locating, setLocating] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const heroSectionRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroScrollRef = useRef(null);
  const searchRef = useRef(null);
  const videoRef = useRef(null);

  // High-resolution poster fallback image
  const posterImage = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop";

  // Filter suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matches = DESTINATIONS.filter(
        (d) =>
          d.city.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Handle Autoplay policy fallback
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('[AURA Hero Video] Autoplay blocked or failed, using poster fallback:', error);
          setVideoError(true);
        });
      }
    }
  }, []);

  // Performant scroll-progress-based hero parallax & content fade-out
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const updateHeroParallax = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroSectionRef.current?.offsetHeight || window.innerHeight;

      if (scrollY <= heroHeight * 1.2) {
        const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

        // Foreground content translate & fade (opacity 1 -> 0 over first 65% of hero scroll)
        const contentOpacity = Math.max(1 - progress * 1.6, 0);
        const contentTranslateY = -(progress * 65);

        if (heroContentRef.current) {
          heroContentRef.current.style.transform = `translate3d(0, ${contentTranslateY}px, 0)`;
          heroContentRef.current.style.opacity = contentOpacity;
        }

        // Background video/image subtle parallax (moves slower than content)
        const bgTranslateY = progress * 30;
        if (heroBgRef.current) {
          heroBgRef.current.style.transform = `scale(1.05) translate3d(0, ${bgTranslateY}px, 0)`;
        }

        // Scroll indicator fade out quickly
        if (heroScrollRef.current) {
          heroScrollRef.current.style.opacity = Math.max(0.75 - progress * 3, 0);
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLocationClick = async () => {
    setLocating(true);
    try {
      const loc = await getCurrentUserLocation();
      setLocating(false);
      if (loc && loc.nearestDestination) {
        navigate(`/destination/${loc.nearestDestination.id}`);
      }
    } catch (err) {
      setLocating(false);
      navigate(`/explore`);
    }
  };

  return (
    <section ref={heroSectionRef} className="relative w-full h-screen min-h-[600px] sm:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#0D0D0E]">
      {/* Background Video / Poster Container with Parallax Ref */}
      <div ref={heroBgRef} className="absolute inset-0 w-full h-full pointer-events-none transition-transform ease-out">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            poster={posterImage}
            className="w-full h-full object-cover scale-105"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-rocky-beach-with-turquoise-water-41551-large.mp4"
              type="video/mp4"
            />
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-top-aerial-view-of-beach-and-sea-waves-41549-large.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={posterImage}
            alt="AURA Travel Ambient"
            className="w-full h-full object-cover scale-105"
          />
        )}
      </div>

      {/* Cinematic Dark Overlay */}
      <div className="absolute inset-0 video-overlay-gradient pointer-events-none" />

      {/* Content Container — Staggered Entrance + Scroll Fade Ref */}
      <div ref={heroContentRef} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-aura-sand pt-16 sm:pt-20">
        {/* Brand Tagline (Step 1: 0–600ms) */}
        <div className="hero-enter-badge inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-aura-sand mb-4 sm:mb-6 max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-aura-terracotta flex-shrink-0" />
          <span className="truncate">AURA Travel Curator</span>
        </div>

        {/* Main Headline (Step 2: 150–850ms & Step 3: 300–1000ms) */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-normal tracking-tight leading-[1.12] mb-4 sm:mb-6 text-aura-sand drop-shadow-md">
          <span className="hero-enter-title-1 block">The world is waiting.</span>
          <span className="hero-enter-title-2 block italic font-light text-aura-sand/90">Where will you go?</span>
        </h1>

        {/* Supporting Copy (Step 4: 450–1100ms) */}
        <p className="hero-enter-desc max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-aura-sand/80 font-sans font-light leading-relaxed mb-6 sm:mb-10 px-2">
          Discover remarkable places, understand them in real time, and let AI turn your curiosity into a trip.
        </p>

        {/* Search Interface Container (Step 5: 600–1250ms) */}
        <div className="hero-enter-search relative max-w-2xl mx-auto w-full px-1" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative z-20">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-aura-card/95 backdrop-blur-xl border border-white/15 rounded-2xl sm:rounded-full p-2 sm:p-2 shadow-modal transition-all duration-300 focus-within:border-aura-terracotta/60 focus-within:ring-2 focus-within:ring-aura-terracotta/20 gap-2 sm:gap-0">
              <div className="flex items-center w-full px-3 py-2 sm:py-0 min-h-[44px]">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-aura-muted mr-2.5 sm:mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search cities, countries or destinations..."
                  className="w-full bg-transparent text-aura-sand placeholder-aura-muted/70 text-xs sm:text-sm focus:outline-none py-1"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-aura-border/40 sm:border-l sm:border-aura-border/40 sm:pl-3 pr-0 sm:pr-1">
                <button
                  type="button"
                  onClick={handleLocationClick}
                  disabled={locating}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] sm:text-xs uppercase tracking-wider text-aura-sand/90 hover:text-white bg-white/5 sm:bg-transparent hover:bg-white/10 sm:hover:bg-white/5 rounded-full sm:rounded-full transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-aura-terracotta min-h-[40px]"
                  title="Use my location"
                >
                  <Navigation className={`w-3.5 h-3.5 text-aura-terracotta flex-shrink-0 ${locating ? 'animate-spin' : ''}`} />
                  <span>{locating ? 'Locating...' : 'Use My Location'}</span>
                </button>

                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 bg-aura-terracotta hover:bg-aura-terracotta-dark text-white text-[11px] sm:text-xs font-semibold uppercase tracking-widest rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-aura-terracotta min-h-[40px] flex items-center justify-center"
                >
                  Explore
                </button>
              </div>
            </div>
          </form>

          {/* Search Autocomplete Dropdown */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-aura-card/95 backdrop-blur-xl border border-aura-border rounded-2xl p-2 shadow-modal z-30 text-left animate-fade-in max-h-60 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-aura-muted font-semibold">
                Suggested Destinations
              </div>
              {suggestions.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => {
                    setSearchQuery(dest.city);
                    setIsFocused(false);
                    navigate(`/destination/${dest.id}`);
                  }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-aura-terracotta flex-shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-aura-sand">{dest.city}</div>
                      <div className="text-[11px] text-aura-muted">{dest.country} · {dest.region}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-aura-terracotta font-serif italic">Explore →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator (Step 6: 800–1400ms) */}
      <div ref={heroScrollRef} className="hero-enter-scroll absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-aura-sand/70 font-sans">Scroll to Discover</span>
        <ChevronDown className="w-4 h-4 text-aura-terracotta animate-bounce" />
      </div>
    </section>
  );
}
