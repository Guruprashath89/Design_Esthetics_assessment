# AURA — World Travel & Intelligent Trip Planning

> **Design Esthetics Front-End Assessment**  
> *A premium travel discovery product combining editorial travel journalism with modern digital UX and conversational AI trip planning.*

---

## Overview

**AURA** is a production-quality web application designed to help visitors explore remarkable destinations across the globe, understand live weather conditions in real-time, discover notable architectural & natural landmarks, and generate bespoke day-by-day trip itineraries using Google Gemini AI.

The application follows an editorial design philosophy: **Playfair Display** typography, restrained warm dark color palette (`#0D0D0E`), asymmetrical image layouts, smooth video motion, and zero template feel.

---

## Key Features

- **Cinematic Looping Hero Video**: Full-screen ambient video background with subtle editorial dark overlay, search autocomplete, and "Use my location" browser geolocation integration.
- **Curated Destination Index**: Exactly 21 iconic global sanctums (*Kyoto, Tokyo, Paris, Bali, London, New York, Dubai, Sydney, Cape Town, Rome, Amalfi Coast, Reykjavik, Bangkok, Barcelona, Istanbul, Marrakech, Seoul, Singapore, Rio de Janeiro, Auckland, Santorini*) with deep metadata, optimal visit months, and latitude/longitude coordinates.
- **Dynamic Region & Vibe Explorer**: Instant, zero-reload filtering by region (*Asia, Europe, Americas, Africa, Oceania*) and travel mood (*Chase the sun, Into the wild, Slow escapes, Culture & history*).
- **"Worth the Detour" Famous Places**: Visual content cards showcasing landmark photos, descriptions, categories, and location notes (never bare lists).
- **Real-Time Weather Integration**: Live meteorological data (temperature, feels-like, humidity, wind) powered by OpenWeather API with an explicit, designed error state (*"Weather information is temporarily unavailable"*) if API keys or network fail.
- **Secure Gemini AI Travel Assistant**: Conversational assistant accessible via floating trigger button or destination CTAs.
- **Structured Day-by-Day Itineraries**: AI generates structured JSON itineraries rendered as an interactive, copyable timeline UI (Day 01, Day 02, time slots, locations, and copy-to-clipboard functionality).
- **Mobile-First Responsive UX**: Optimized for viewports from 375px (mobile) to 1440px+ (large desktop).
- **Accessibility & Focus States**: Semantic HTML5 elements (`main`, `header`, `footer`, `section`, `article`), visible focus rings, ARIA labels, and high contrast ratios.

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) + Custom HSL Editorial Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Google Fonts (*Playfair Display* display font + *Inter* interface font)
- **Deployment**: Vercel (with Serverless Function `/api/chat`)

---

## APIs & Services

1. **Google Gemini AI API**: Used for conversational travel advice and structured JSON trip itinerary generation. Routed through `/api/chat` serverless function to ensure `GEMINI_API_KEY` never leaks into browser bundles.
2. **OpenWeather API**: Real-time meteorological metric engine (`https://api.openweathermap.org/data/2.5/weather`).
3. **Unsplash API & CDN**: High-resolution dynamic photography with search terms and graceful fallback placeholders.
4. **HTML5 Geolocation API**: Calculates nearest destination from user coordinates via Haversine formula across all 21 curated destinations.

---

## Environment Variables

Copy `.env.example` to `.env` in the root directory:

```bash
# OpenWeather API Key (Free tier key from openweathermap.org)
VITE_OPENWEATHER_API_KEY=your_openweather_key_here

# Unsplash Access Key (Developer key from unsplash.com/developers)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# Google Gemini API Key (Server-side key for serverless route /api/chat)
GEMINI_API_KEY=your_gemini_key_here
```

---

## Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-username/aura-travel-app.git
cd aura-travel-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server
npm run dev
```

The application will be running at `http://localhost:3000`.

---

## Building & Deployment

```bash
# Generate production bundle
npm run build

# Preview production build locally
npm run preview
```
