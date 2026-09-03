import React, { useState, useEffect } from 'react';
import { fetchLiveWeather } from '../services/weatherService';
import { Thermometer, Wind, Droplets, RefreshCw, AlertCircle } from 'lucide-react';

export default function WeatherCard({ cityQuery, lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadWeather = async (force = false) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchLiveWeather(cityQuery, lat, lon, force);
      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.warn('[AURA Weather Component] Weather API error:', err.message || err);
      setErrorMsg(err.message || 'Weather information is temporarily unavailable.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state immediately on destination switch to prevent stale weather data
    setWeather(null);
    setLoading(true);
    setErrorMsg('');

    if (cityQuery || (lat && lon)) {
      loadWeather(false);
    }
  }, [cityQuery, lat, lon]);

  if (loading) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-aura-card/90 border border-aura-border text-aura-sand flex items-center justify-between gap-3 animate-pulse w-full">
        <div className="space-y-1.5 min-w-0">
          <div className="text-xs text-aura-muted font-sans flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-aura-terracotta animate-spin" />
            <span>Loading current weather…</span>
          </div>
          <div className="w-24 h-5 bg-white/10 rounded"></div>
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-full flex-shrink-0"></div>
      </div>
    );
  }

  // Unavailable or diagnostic error state
  if (errorMsg || !weather) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-aura-card/80 border border-aura-border/80 text-aura-sand flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertCircle className="w-4 h-4 text-aura-terracotta flex-shrink-0" />
          <div className="text-xs text-aura-sand font-medium leading-normal">
            {errorMsg || 'Weather information is temporarily unavailable.'}
          </div>
        </div>
        <button
          onClick={() => loadWeather(true)}
          className="px-3.5 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-aura-sand flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 min-h-[36px] self-end sm:self-auto focus:outline-none focus:ring-2 focus:ring-aura-terracotta"
        >
          <RefreshCw className="w-3 h-3" />
          <span>TRY AGAIN</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-aura-card/90 border border-aura-border text-aura-sand shadow-card space-y-4 w-full">
      {/* Live Temperature & Condition Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-aura-muted font-semibold">
            Live Conditions
          </span>
          <div className="font-serif text-xl sm:text-2xl font-normal text-aura-sand capitalize">
            {weather.condition}
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-serif text-2xl sm:text-3xl font-light text-aura-sand">
            {weather.temp}°C
          </span>
          {weather.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          )}
        </div>
      </div>

      {/* Metrics Row: Temp -> Feels like -> Humidity -> Wind */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-aura-border/50 text-[10px] sm:text-[11px]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-aura-muted">
            <Thermometer className="w-3 h-3 text-aura-terracotta flex-shrink-0" />
            <span>Feels Like</span>
          </div>
          <div className="font-medium text-aura-sand">{weather.feelsLike}°C</div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-aura-muted">
            <Droplets className="w-3 h-3 text-aura-gold flex-shrink-0" />
            <span>Humidity</span>
          </div>
          <div className="font-medium text-aura-sand">{weather.humidity}%</div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-aura-muted">
            <Wind className="w-3 h-3 text-aura-sand flex-shrink-0" />
            <span>Wind</span>
          </div>
          <div className="font-medium text-aura-sand">{weather.windSpeed} km/h</div>
        </div>
      </div>
    </div>
  );
}
