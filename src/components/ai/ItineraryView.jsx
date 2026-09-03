import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Check, Share2 } from 'lucide-react';

export default function ItineraryView({ itinerary }) {
  const [copied, setCopied] = useState(false);

  if (!itinerary || typeof itinerary !== 'object') {
    return (
      <div className="p-4 rounded-xl bg-aura-card border border-aura-border text-xs text-aura-muted">
        We couldn't shape that itinerary just yet. Try asking AURA again.
      </div>
    );
  }

  const {
    destination = 'Selected Destination',
    duration = 5,
    tripTitle = 'Curated Journey',
    days = []
  } = itinerary;

  const handleCopyItinerary = () => {
    const textLines = [`YOUR ${destination.toUpperCase()} JOURNEY — ${duration} DAYS`, tripTitle, ''];
    days.forEach((d) => {
      textLines.push(`DAY ${String(d.day || 1).padStart(2, '0')}: ${d.title || 'Exploration'}`);
      d.activities?.forEach((act) => {
        textLines.push(`  ${act.time || 'Flexible'} - ${act.title || 'Activity'}`);
        if (act.description) textLines.push(`  ${act.description}`);
        if (act.location) textLines.push(`  Location: ${act.location}`);
        textLines.push('');
      });
    });

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in py-4">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-aura-card via-aura-card-hover to-aura-dark p-6 border border-aura-terracotta/30 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-aura-terracotta font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Bespoke Itinerary</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-aura-sand">
              Your {destination} Journey
            </h3>
            <p className="text-xs text-aura-muted font-sans font-light">
              {tripTitle || `${duration} days of curated discovery`}
            </p>
          </div>

          <button
            onClick={handleCopyItinerary}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider bg-white/10 hover:bg-white/15 border border-white/15 rounded-full text-aura-sand transition-colors focus:outline-none focus:ring-2 focus:ring-aura-terracotta"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-aura-terracotta" />
                <span>Export Itinerary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Days Timeline Flow */}
      <div className="space-y-8 relative">
        <div className="hidden sm:block absolute left-4 top-8 bottom-8 w-0.5 bg-aura-border/60" />

        {days.map((dayData, dIdx) => (
          <div key={dIdx} className="relative sm:pl-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex absolute left-0 w-8 h-8 rounded-full bg-aura-terracotta/20 border border-aura-terracotta items-center justify-center text-xs font-serif text-aura-terracotta font-bold">
                {dayData.day || dIdx + 1}
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aura-terracotta/15 border border-aura-terracotta/30 text-xs font-semibold uppercase tracking-widest text-aura-terracotta">
                <Calendar className="w-3 h-3" />
                <span>DAY {String(dayData.day || dIdx + 1).padStart(2, '0')}</span>
              </div>
              <h4 className="font-serif text-xl text-aura-sand">
                {dayData.title || `Day ${dIdx + 1} Theme`}
              </h4>
            </div>

            <div className="space-y-3">
              {Array.isArray(dayData.activities) && dayData.activities.map((activity, aIdx) => (
                <div
                  key={aIdx}
                  className="p-5 rounded-xl bg-aura-card/80 border border-aura-border hover:border-aura-terracotta/30 transition-all duration-300 space-y-2 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-aura-terracotta">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activity.time || 'Flexible'}</span>
                      <span className="text-aura-sand font-serif font-normal text-base ml-1">
                        {activity.title || 'Sanctum Visit'}
                      </span>
                    </div>

                    {activity.location && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-aura-muted bg-white/5 px-2.5 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3 text-aura-gold" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                  </div>

                  {activity.description && (
                    <p className="text-xs text-aura-muted font-sans font-light leading-relaxed">
                      {activity.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
