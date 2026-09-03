import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer({ onOpenAI }) {
  return (
    <footer className="bg-aura-dark border-t border-aura-border pt-16 pb-12 px-6 md:px-12 text-aura-sand/70">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl tracking-widest text-aura-sand font-bold">
              AURA
            </span>
          </Link>
          <p className="text-xs text-aura-muted leading-relaxed font-sans">
            A premium travel discovery and intelligent trip planning platform. Designed for curiosity, stillness, and bespoke global journeys.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAI}
              className="inline-flex items-center gap-2 text-xs text-aura-terracotta hover:underline uppercase tracking-wider font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AURA Assistant</span>
            </button>
          </div>
        </div>

        {/* Regions Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-aura-sand font-sans">
            Destinations by Region
          </h4>
          <ul className="space-y-2 text-xs text-aura-muted">
            <li><Link to="/explore?region=Asia" className="hover:text-aura-sand transition-colors">Asia & Pacific</Link></li>
            <li><Link to="/explore?region=Europe" className="hover:text-aura-sand transition-colors">Europe & Mediterranean</Link></li>
            <li><Link to="/explore?region=Americas" className="hover:text-aura-sand transition-colors">The Americas</Link></li>
            <li><Link to="/explore?region=Africa" className="hover:text-aura-sand transition-colors">Africa & Wild Reserves</Link></li>
            <li><Link to="/explore?region=Oceania" className="hover:text-aura-sand transition-colors">Oceania & Island Havens</Link></li>
          </ul>
        </div>

        {/* Curated Highlights */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-aura-sand font-sans">
            Featured Sanctums
          </h4>
          <ul className="space-y-2 text-xs text-aura-muted">
            <li><Link to="/destination/kyoto" className="hover:text-aura-sand transition-colors">Kyoto — Zen Gardens & Temples</Link></li>
            <li><Link to="/destination/santorini" className="hover:text-aura-sand transition-colors">Santorini — Volcanic Sunset Cliffs</Link></li>
            <li><Link to="/destination/amalfi-coast" className="hover:text-aura-sand transition-colors">Amalfi Coast — Cliffside Villas</Link></li>
            <li><Link to="/destination/bali" className="hover:text-aura-sand transition-colors">Ubud — Terraced Valleys</Link></li>
            <li><Link to="/destination/reykjavik" className="hover:text-aura-sand transition-colors">Reykjavik — Aurora Fjords</Link></li>
          </ul>
        </div>

        {/* Assessment Credits */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-aura-sand font-sans">
            Design Philosophy
          </h4>
          <p className="text-xs text-aura-muted leading-relaxed">
            Crafted for the Design Esthetics Front-End Developer Assessment. Built with React, Tailwind CSS, OpenWeather API, Unsplash image engine, and Google Gemini AI.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-aura-border/40 flex flex-col md:flex-row items-center justify-between text-[11px] text-aura-muted gap-4">
        <div>
          © {new Date().getFullYear()} AURA Travel Technologies. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span>Privacy Policy</span>
          <span>Editorial Standards</span>
          <span>Terms of Exploration</span>
        </div>
      </div>
    </footer>
  );
}
