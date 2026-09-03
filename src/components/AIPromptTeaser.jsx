import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import useScrollLinkedReveal from '../hooks/useScrollLinkedReveal';

export default function AIPromptTeaser({ onLaunchAI }) {
  const [naturalPrompt, setNaturalPrompt] = useState('7 days in Japan · ancient temples · great food · slow pace');
  const sectionRef = useRef(null);
  useScrollLinkedReveal(sectionRef, []);

  const presetPrompts = [
    '7 days in Japan · ancient temples · great food',
    '5 days on Amalfi Coast · cliffside views · boat trips',
    '4 days in Iceland · thermal lagoons · aurora spots',
    '6 days in Bali · wellness retreats · rice terrace trails'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLaunchAI) {
      onLaunchAI(naturalPrompt);
    }
  };

  return (
    <section ref={sectionRef} className="scroll-linked scroll-mt-24 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-aura-card via-aura-card-hover to-aura-dark border border-aura-terracotta/30 p-5 sm:p-8 md:p-10 overflow-hidden shadow-modal">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-aura-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aura-terracotta/10 border border-aura-terracotta/30 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-aura-terracotta max-w-full">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">AI TRIP ARCHITECT</span>
          </div>

          {/* Headline & Copy */}
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-aura-sand leading-tight">
              Don’t know where to start?
            </h2>
            <p className="text-xs sm:text-sm text-aura-sand/80 font-sans font-light leading-relaxed">
              Tell AURA what you're looking for, and receive a structured day-by-day journey tailored to your exact pace.
            </p>
          </div>

          {/* Natural Planning Input */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-aura-dark/90 border border-white/15 rounded-xl sm:rounded-full p-2 shadow-card focus-within:border-aura-terracotta/60 transition-colors gap-2 sm:gap-0">
              <input
                type="text"
                value={naturalPrompt}
                onChange={(e) => setNaturalPrompt(e.target.value)}
                placeholder="7 days in Japan · ancient temples · great food · slow pace"
                className="w-full bg-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm text-aura-sand placeholder-aura-muted focus:outline-none min-h-[40px]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-aura-terracotta hover:bg-aura-terracotta-dark text-white text-[11px] font-semibold uppercase tracking-widest rounded-lg sm:rounded-full transition-all duration-300 shadow-glow flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
              >
                <span>BUILD MY TRIP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-aura-muted font-sans mr-1 font-medium w-full sm:w-auto">Inspiration:</span>
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNaturalPrompt(preset)}
                  className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-aura-sand/80 hover:text-aura-sand border border-white/10 transition-colors text-left max-w-full truncate min-h-[32px] flex items-center"
                >
                  {preset}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
