import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Navigation, Menu, X, ArrowRight } from 'lucide-react';
import { getCurrentUserLocation } from '../services/locationService';

export default function Navbar({ onOpenAI, onLocationFound }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationResult, setLocationResult] = useState(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolledNow = window.scrollY > 10;
          setScrolled((prev) => (prev !== isScrolledNow ? isScrolledNow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Auto-dismiss location toast after 6 seconds
  useEffect(() => {
    if (locationResult) {
      const timer = setTimeout(() => {
        setLocationResult(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [locationResult]);

  const handleUseMyLocation = async () => {
    setLocating(true);
    setLocationResult(null);
    try {
      const locData = await getCurrentUserLocation();
      setLocating(false);
      if (locData && locData.nearestDestination) {
        setLocationResult({
          success: true,
          destination: locData.nearestDestination,
          distanceKm: locData.distanceKm
        });
        if (onLocationFound) {
          onLocationFound(locData);
        }
      }
    } catch (err) {
      setLocating(false);
      setLocationResult({
        success: false,
        message: err.message || "Location access isn't available. You can still explore anywhere in the world."
      });
    }
  };

  const handleGoToLocationDestination = () => {
    if (locationResult?.destination) {
      const destId = locationResult.destination.id;
      setLocationResult(null);
      navigate(`/destination/${destId}`);
    }
  };

  return (
    <>
      {/* Fixed Navbar Header */}
      <header className="fixed top-0 left-0 right-0 z-40 py-4 sm:py-5">
        {/* Background Layer — Pure color transition without backdrop-filter blur */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ease-out ${
            scrolled
              ? 'bg-[#0b0b0c] border-b border-aura-border/40 shadow-xl'
              : 'bg-transparent border-b border-transparent'
          }`}
          style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link to="/" className="group flex items-center gap-2.5 min-h-[44px]">
            <span className="font-serif text-2xl sm:text-3xl tracking-widest text-aura-sand font-bold group-hover:text-aura-terracotta transition-colors duration-300">
              AURA
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-aura-terracotta"></span>
            <span className="hidden sm:inline-block text-[10px] tracking-[0.25em] text-aura-muted uppercase font-sans">
              Travel & AI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wider">
            <Link
              to="/"
              className={`transition-colors duration-200 py-2 ${
                location.pathname === '/'
                  ? 'text-aura-terracotta font-medium'
                  : 'text-aura-sand/80 hover:text-aura-sand'
              }`}
            >
              Discover
            </Link>
            <Link
              to="/explore"
              className={`transition-colors duration-200 py-2 ${
                location.pathname === '/explore'
                  ? 'text-aura-terracotta font-medium'
                  : 'text-aura-sand/80 hover:text-aura-sand'
              }`}
            >
              Explore World
            </Link>
          </nav>

          {/* Actions Right */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleUseMyLocation}
              disabled={locating}
              className="flex items-center gap-2 px-3.5 py-2 text-xs tracking-wider uppercase bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-aura-sand/90 transition-all duration-300 hover:border-aura-terracotta/40 focus:outline-none focus:ring-2 focus:ring-aura-terracotta min-h-[40px]"
              title="Use my location"
              aria-label="Use my location"
            >
              <Navigation className={`w-3.5 h-3.5 text-aura-terracotta ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Locating...' : 'Use My Location'}</span>
            </button>

            <button
              onClick={onOpenAI}
              className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest bg-aura-terracotta hover:bg-aura-terracotta-dark text-white rounded-full transition-all duration-300 shadow-glow hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-aura-terracotta min-h-[40px]"
            >
              <Sparkles className="w-4 h-4 text-aura-sand" />
              <span>Ask AURA</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenAI}
              className="p-2.5 bg-aura-terracotta text-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-aura-terracotta flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-aura-sand hover:text-white focus:outline-none min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="relative z-20 md:hidden bg-[#0b0b0c] border-b border-aura-border px-5 py-6 space-y-4 animate-fade-in mt-3 shadow-2xl">
            <nav className="flex flex-col gap-3 font-serif text-lg tracking-wider">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-aura-sand hover:text-aura-terracotta py-2 min-h-[44px] flex items-center"
              >
                Home / Discover
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="text-aura-sand hover:text-aura-terracotta py-2 min-h-[44px] flex items-center"
              >
                Explore Destinations
              </Link>
            </nav>

            <div className="pt-4 border-t border-aura-border flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleUseMyLocation();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-wider bg-white/5 border border-white/10 rounded-full text-aura-sand min-h-[44px]"
              >
                <Navigation className="w-4 h-4 text-aura-terracotta" />
                <span>Use My Location</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAI();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase font-semibold tracking-widest bg-aura-terracotta text-white rounded-full shadow-glow min-h-[44px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AURA Assistant</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Transparent Editorial Location Result Banner Toast */}
      {locationResult && (
        <div className="fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-[92%] sm:w-auto animate-fade-in">
          {locationResult.success ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl sm:rounded-full bg-[#0b0b0c] border border-aura-terracotta/40 shadow-modal text-xs text-aura-sand">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-aura-terracotta animate-pulse flex-shrink-0" />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-widest text-aura-terracotta font-semibold">
                    Location Found
                  </div>
                  <div className="text-aura-sand/90 font-sans text-[11px] sm:text-xs">
                    Closest curated destination:{' '}
                    <span className="font-serif italic font-medium text-white">{locationResult.destination.city}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoToLocationDestination}
                className="flex items-center gap-1 px-3 py-1.5 bg-aura-terracotta hover:bg-aura-terracotta-dark text-white rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm min-h-[32px]"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl sm:rounded-full bg-[#0b0b0c] border border-white/10 shadow-modal text-xs text-aura-sand">
              <span className="text-[11px] sm:text-xs">{locationResult.message}</span>
              <button
                onClick={() => setLocationResult(null)}
                className="text-aura-muted hover:text-white text-xs font-bold p-1 min-w-[28px] min-h-[28px]"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
