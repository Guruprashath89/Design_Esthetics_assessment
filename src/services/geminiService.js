/**
 * Client Service for AURA AI Travel Assistant
 * Interacts with internal serverless route /api/chat
 */

import { DESTINATIONS } from '../data/destinationsData';
import { parseItinerary } from '../utils/itineraryParser';

export async function askAuraAssistant({ prompt, history = [], destinationContext, mode = 'chat' }) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        history,
        destinationContext,
        mode
      })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data) {
      // Check if data is already structured itinerary or if reply string contains itinerary JSON
      const parsedItinerary = parseItinerary(data.data) || parseItinerary(data.reply);
      if (parsedItinerary) {
        return {
          mode: 'itinerary',
          data: parsedItinerary
        };
      }
      return data;
    }

    // If server returned a specific error message (such as missing or invalid API key), display it!
    if (data && data.userMessage) {
      return {
        mode: 'chat',
        reply: data.userMessage
      };
    }

    throw new Error(data.error || "AURA is taking a moment. The travel assistant isn't available right now.");
  } catch (error) {
    console.warn('[AURA Gemini Service] Request failed:', error.message);
    
    // Provide a polished deterministic response when server API is offline or disconnected
    if (mode === 'itinerary') {
      return getFallbackItinerary(destinationContext, prompt, history);
    }
    
    return {
      mode: 'chat',
      reply: getFallbackChatReply(destinationContext, prompt, history)
    };
  }
}

/**
 * Intelligent context-aware conversational fallback
 * Used when network is completely offline.
 */
function getFallbackChatReply(destinationContext, prompt, history = []) {
  const p = (prompt || '').toLowerCase().trim();

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i.test(p)) {
    return "Hi! I'm AURA, your global travel curator. Where would you like to explore?";
  }

  // 2. Identity & Name questions
  if (p.includes("what is your name") || p.includes("who are you") || p.includes("your name")) {
    return "I'm AURA. I can help you discover destinations, choose the best time to travel, and build personalized itineraries.";
  }

  // 3. Capabilities questions
  if (p.includes("what can you do") || p.includes("how can you help") || p.includes("your capabilities")) {
    return "I am your personal travel architect. I can introduce you to 21 curated global sanctums, recommend optimal seasons to visit, curate notable culinary and cultural landmarks, and design structured day-by-day itineraries tailored to your pace.";
  }

  // 4. Check for destination established in conversation history or current prompt
  let activeDest = destinationContext;
  if (!activeDest) {
    activeDest = DESTINATIONS.find(d => 
      p.includes(d.city.toLowerCase()) || 
      p.includes(d.country.toLowerCase()) ||
      d.id.toLowerCase().includes(p)
    );

    if (!activeDest && Array.isArray(history)) {
      for (let i = history.length - 1; i >= 0; i--) {
        const hText = (history[i].text || '').toLowerCase();
        const found = DESTINATIONS.find(d => 
          hText.includes(d.city.toLowerCase()) || 
          hText.includes(d.country.toLowerCase())
        );
        if (found) {
          activeDest = found;
          break;
        }
      }
    }
  }

  const cityName = activeDest ? activeDest.city : null;

  // 5. Sightseeing / What to see
  if (p.includes("see") || p.includes("visit") || p.includes("must") || p.includes("place") || p.includes("attraction") || p.includes("do")) {
    if (activeDest) {
      const places = activeDest.famousPlaces ? activeDest.famousPlaces.map(f => f.name).join(', ') : 'historic temples, scenic heights, and landmark architecture';
      return `In ${cityName}, prioritize visits to ${places}. I recommend visiting high-demand sites early in the morning, followed by quiet afternoon retreats in the historic quarter.`;
    }
    return "Across our 21 curated destinations, we highlight architectural landmarks, ancient spiritual grounds, and pristine natural vistas. Which region or vibe draws your curiosity?";
  }

  // General travel inquiry fallback
  return "I'm here to help curate your next journey across 21 iconic destinations—from the tranquil zen gardens of Kyoto and caldera cliffs of Santorini, to the vibrant medina of Marrakech. What type of escape are you seeking?";
}

/**
 * Intelligent fallback trip generator
 */
function getFallbackItinerary(destinationContext, prompt, history = []) {
  let city = destinationContext?.city;
  if (!city) {
    const p = (prompt || '').toLowerCase();
    const match = DESTINATIONS.find(d => 
      p.includes(d.city.toLowerCase()) || 
      p.includes(d.country.toLowerCase())
    );
    if (match) city = match.city;
    else if (Array.isArray(history)) {
      for (let i = history.length - 1; i >= 0; i--) {
        const hText = (history[i].text || '').toLowerCase();
        const found = DESTINATIONS.find(d => 
          hText.includes(d.city.toLowerCase()) || 
          hText.includes(d.country.toLowerCase())
        );
        if (found) {
          city = found.city;
          break;
        }
      }
    }
  }

  if (!city) city = "Kyoto";

  let duration = 5;
  const matchDays = prompt.match(/(\d+)\s*day/i);
  if (matchDays && matchDays[1]) {
    duration = Math.min(Math.max(parseInt(matchDays[1], 10), 2), 7);
  }

  const allDays = [
    {
      day: 1,
      title: "Arrival & Historic Quarter",
      activities: [
        {
          time: "09:30",
          title: "Historic District Exploration",
          description: "Stroll through preserved architectural quarters as the morning light settles.",
          location: "Historic Old Town"
        },
        {
          time: "13:00",
          title: "Artisanal Local Lunch",
          description: "Savor seasonal cuisine at a traditional neighborhood bistro.",
          location: "City Center"
        }
      ]
    },
    {
      day: 2,
      title: "Art, Architecture & Gastronomy",
      activities: [
        {
          time: "10:00",
          title: "Flagship Cultural Landmark",
          description: "Explore world-renowned artistic collections and heritage treasures.",
          location: "Cultural Quarter"
        }
      ]
    }
  ];

  return {
    mode: 'itinerary',
    data: {
      destination: city,
      duration: duration,
      tripTitle: `${city} Curated Odyssey`,
      days: allDays.slice(0, duration)
    }
  };
}
