import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, CloudSun, Compass } from 'lucide-react';

export default function DestinationCard({ destination, featured = false, layoutVariant = 'standard' }) {
  const { id, city, country, region, shortDescription, heroImage, tags, averageTemp } = destination;
  const [imgError, setImgError] = useState(false);

  if (layoutVariant === 'hero-large') {
    return (
      <Link
        to={`/destination/${id}`}
        className="group relative block w-full h-[400px] sm:h-[480px] md:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-card border border-white/10 hover:border-aura-terracotta/50 transition-all duration-500 bg-aura-card"
      >
        {!imgError ? (
          <img
            src={heroImage}
            alt={`${city}, ${country}`}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-aura-card-hover via-aura-card to-aura-dark flex items-center justify-center p-8 text-center">
            <Compass className="w-16 h-16 text-aura-terracotta/40 animate-pulse" />
          </div>
        )}
        <div className="absolute inset-0 card-image-gradient" />

        <div className="absolute inset-0 p-5 sm:p-8 md:p-12 flex flex-col justify-between z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aura-dark/70 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-medium text-aura-sand">
              <MapPin className="w-3.5 h-3.5 text-aura-terracotta" />
              <span>{region}</span>
            </div>
            {averageTemp && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-aura-dark/70 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-aura-sand">
                <CloudSun className="w-3.5 h-3.5 text-aura-gold" />
                <span>{averageTemp}</span>
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-aura-terracotta font-semibold">
                {country}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-aura-sand font-normal group-hover:text-aura-sand/90 transition-colors">
                {city}
              </h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-aura-sand/80 font-sans font-light leading-relaxed line-clamp-2">
              {shortDescription}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-aura-sand/90 font-sans"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-aura-terracotta group-hover:translate-x-1 transition-transform">
                Explore Sanctum <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/destination/${id}`}
      className="group relative flex flex-col h-[390px] sm:h-[380px] rounded-2xl overflow-hidden bg-aura-card border border-aura-border hover:border-aura-terracotta/40 transition-all duration-500 shadow-card"
    >
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-aura-card-hover flex-shrink-0">
        {!imgError ? (
          <img
            src={heroImage}
            alt={`${city}, ${country}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-aura-card-hover to-aura-dark flex items-center justify-center p-4">
            <Compass className="w-10 h-10 text-aura-terracotta/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-aura-card via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-aura-dark/80 backdrop-blur-md text-aura-sand/90 border border-white/10 font-medium">
            {country}
          </span>
          {averageTemp && (
            <span className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full bg-aura-dark/80 backdrop-blur-md text-aura-sand border border-white/10 flex items-center gap-1">
              <CloudSun className="w-3 h-3 text-aura-gold" />
              {averageTemp}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl text-aura-sand group-hover:text-aura-terracotta transition-colors duration-300">
            {city}
          </h3>
          <p className="text-xs text-aura-muted font-sans font-light leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-aura-border/40 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] text-aura-muted bg-white/5 px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
          <ArrowUpRight className="w-4 h-4 text-aura-terracotta group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
