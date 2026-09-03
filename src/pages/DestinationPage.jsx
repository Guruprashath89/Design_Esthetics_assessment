import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinationsData';
import WeatherCard from '../components/WeatherCard';
import FamousPlacesGrid from '../components/FamousPlacesGrid';
import { MapPin, Calendar, Sparkles, ArrowLeft, Compass, Globe } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function DestinationPage({ onOpenAIWithContext }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [heroImgError, setHeroImgError] = useState(false);
  const containerRef = useRef(null);

  useScrollReveal(containerRef, [id]);

  const destination = DESTINATIONS.find((d) => d.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!destination) {
    return (
      <div className="pt-32 pb-24 px-6 text-center max-w-md mx-auto space-y-6">
        <h2 className="font-serif text-3xl text-aura-sand">Destination Not Found</h2>
        <p className="text-xs text-aura-muted">The requested destination does not exist in our curated index.</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-aura-terracotta text-white rounded-full text-xs uppercase tracking-widest font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Explorer</span>
        </Link>
      </div>
    );
  }

  const {
    city,
    country,
    region,
    latitude,
    longitude,
    shortDescription,
    longDescription,
    heroImage,
    tags,
    weatherSearchCity,
    bestMonths,
    famousPlaces
  } = destination;

  return (
    <div ref={containerRef} className="space-y-8 sm:space-y-12 pb-20">
      {/* Destination Hero Banner — Tightened Vertical Height */}
      <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] min-h-[380px] sm:min-h-[420px] max-h-[600px] flex items-end overflow-hidden bg-aura-card">
        {!heroImgError ? (
          <img
            src={heroImage}
            alt={`${city}, ${country}`}
            onError={() => setHeroImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-aura-card-hover via-aura-card to-aura-dark flex items-center justify-center">
            <Compass className="w-20 h-20 text-aura-terracotta/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-aura-dark via-aura-dark/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-6 sm:pb-8 w-full space-y-2.5 sm:space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aura-dark/70 backdrop-blur-md border border-white/10 text-xs text-aura-sand hover:text-white transition-colors mb-1 focus:outline-none focus:ring-2 focus:ring-aura-terracotta min-h-[36px]"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-aura-terracotta px-2.5 py-0.5 bg-aura-dark/80 backdrop-blur-md rounded-full border border-white/10">
              {country}
            </span>
            <span className="text-[10px] sm:text-[11px] text-aura-sand/80 px-2.5 py-0.5 bg-aura-dark/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-aura-terracotta" />
              {region}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl font-normal text-aura-sand tracking-tight leading-none">
            {city}
          </h1>

          <p className="max-w-3xl text-xs sm:text-base text-aura-sand/90 font-sans font-light leading-relaxed">
            {shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-10 sm:space-y-12">
        {/* Info Metrics Grid & Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Editorial Overview Column */}
          <div className="reveal lg:col-span-2 space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-aura-terracotta font-semibold">
                The Narrative
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-aura-sand">
                About {city}
              </h2>
            </div>
            <p className="text-xs sm:text-base text-aura-sand/80 font-sans font-light leading-relaxed whitespace-pre-line">
              {longDescription}
            </p>

            {/* Travel Tags & Best Months */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-aura-border/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-aura-muted">
                  <Calendar className="w-3.5 h-3.5 text-aura-terracotta flex-shrink-0" />
                  <span>Optimal Visit Window</span>
                </div>
                <div className="text-xs sm:text-sm text-aura-sand font-medium">{bestMonths}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-aura-muted">
                  <Compass className="w-3.5 h-3.5 text-aura-terracotta flex-shrink-0" />
                  <span>Vibe & Classification</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-0.5 rounded bg-white/5 text-aura-sand">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Weather Integration Column */}
          <div className="reveal space-y-3 w-full">
            <h3 className="font-serif text-xl text-aura-sand">Current Weather</h3>
            <WeatherCard cityQuery={weatherSearchCity} lat={latitude} lon={longitude} />
          </div>
        </div>

        {/* Famous Places / Notable Attractions Section */}
        <FamousPlacesGrid famousPlaces={famousPlaces} destinationCity={city} />

        {/* Contextual AI Assistant Banner */}
        <div className="reveal rounded-2xl sm:rounded-3xl bg-gradient-to-br from-aura-card via-aura-card-hover to-aura-dark p-5 sm:p-10 border border-aura-terracotta/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 shadow-modal">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-aura-terracotta font-semibold justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Contextual AI Travel Guide</span>
            </div>
            <h3 className="font-serif text-xl sm:text-3xl text-aura-sand">
              Curious about visiting {city}?
            </h3>
            <p className="text-xs text-aura-muted font-sans font-light max-w-lg">
              Ask AURA about neighborhood dining, secret viewpoints, or generate a 5-day structured itinerary for {city}.
            </p>
          </div>

          <button
            onClick={() => onOpenAIWithContext(destination)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-aura-terracotta hover:bg-aura-terracotta-dark text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-all duration-300 shadow-glow whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-aura-terracotta flex items-center justify-center min-h-[44px]"
          >
            Ask AURA About {city}
          </button>
        </div>
      </div>
    </div>
  );
}
