import fs from 'fs';
import path from 'path';

/**
 * Serverless Function: /api/chat
 * Handles Gemini AI API interactions securely server-side.
 * Uses x-goog-api-key header and current Gemini models (gemini-3.6-flash, gemini-3.5-flash, gemini-3.5-flash-lite, gemini-flash-latest).
 * GEMINI_API_KEY is kept out of client JS bundles.
 */

function getGeminiApiKey() {
  let apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_key_here') {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
          const [k, ...v] = trimmed.split('=');
          const keyName = k.trim();
          const val = v.join('=').trim().replace(/^["']|["']$/g, '');
          if (keyName === 'GEMINI_API_KEY' && val && val !== 'your_key_here') {
            apiKey = val;
            break;
          }
        }
      }
    } catch {
      // Ignore filesystem errors in production serverless environments
    }
  }

  return apiKey ? apiKey.trim() : null;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.error('[AURA Serverless API] GEMINI_API_KEY is missing or unconfigured in .env');
    return res.status(503).json({
      error: 'GEMINI_KEY_MISSING',
      userMessage: 'AURA AI Assistant is unconfigured. Please add a valid GEMINI_API_KEY to your .env file.'
    });
  }

  try {
    const { prompt, history = [], destinationContext, mode } = req.body || {};

    const systemInstruction = `You are AURA, an elite, highly knowledgeable global travel curator and trip architect for a luxury editorial travel publication.
Your tone is sophisticated, welcoming, poetic yet concise, helpful, and editorial.

CRITICAL CONVERSATIONAL GUIDELINES:
1. Natural Conversation: Answer greetings (e.g. "hi", "hello", "good morning") warmly and conversationally (e.g. "Hi! I'm AURA, your global travel curator. Where would you like to go?").
2. Identity: When asked "what is your name?" or "who are you?", answer directly (e.g. "I'm AURA, your global travel curator. I can help you discover remarkable destinations, choose the best time to visit, and build personalized day-by-day itineraries.").
3. Capabilities: When asked "what can you do?", explain your travel capabilities naturally (curating sanctums, suggesting optimal seasons, recommending culinary spots, and designing day-by-day itineraries).
4. Curated Knowledge: You know about AURA's 21 curated destinations: Kyoto, Tokyo, Paris, Bali, London, New York, Dubai, Sydney, Cape Town, Rome, Amalfi Coast, Reykjavik, Bangkok, Barcelona, Istanbul, Marrakech, Seoul, Singapore, Rio de Janeiro, Auckland, and Santorini.
5. Contextual Discipline: Do NOT force a destination into the conversation unless the user mentions it, or the user is viewing that destination and asks a question about it, or the conversation history has already established that destination. Never recite generic canned paragraphs.
6. Memory & Follow-ups: Maintain conversational context across previous turns. If the user mentions a destination in an earlier message (e.g. "I'm thinking about Japan") and then follows up with "I only have 5 days" or "make it more relaxed" or "what about food?", answer in the context of their trip.
7. Itineraries: When explicitly asked to plan a trip, build an itinerary, or create a schedule, output pure JSON adhering to the specified schema without markdown code blocks.`;

    let userPromptText = prompt || 'Hello';

    const contents = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        if (!msg.text || typeof msg.text !== 'string') continue;
        const role = msg.role === 'user' ? 'user' : 'model';
        contents.push({
          role,
          parts: [{ text: msg.text }]
        });
      }
    }

    let currentTurnText = userPromptText;
    if (mode === 'itinerary') {
      currentTurnText = `[CRITICAL REQUIREMENT: Output pure valid JSON ONLY without \`\`\`json or markdown wrapping conforming to this structure:
{
  "destination": "${destinationContext?.city || 'Selected Destination'}",
  "duration": 5,
  "tripTitle": "Curated Journey",
  "days": [
    {
      "day": 1,
      "title": "Day Theme",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity Name",
          "description": "Short vivid description.",
          "location": "Neighborhood or Landmark"
        }
      ]
    }
  ]
}]
User request: ${userPromptText}`;
    } else if (destinationContext && !history.length) {
      currentTurnText = `[User is currently viewing: ${destinationContext.city}, ${destinationContext.country}] ${userPromptText}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: currentTurnText }]
    });

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents,
      generationConfig: {
        temperature: mode === 'itinerary' ? 0.2 : 0.7,
        maxOutputTokens: 2048
      }
    };

    // Active models in order of priority (with 3.5 fallback for spikes)
    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-flash-latest'
    ];

    let response = null;
    let lastErrorText = '';

    for (const modelName of modelsToTry) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
      
      try {
        response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          break;
        } else {
          lastErrorText = await response.text();
          console.warn(`[Gemini API] Model ${modelName} returned HTTP ${response.status}: ${lastErrorText}`);
        }
      } catch (fetchErr) {
        console.warn(`[Gemini API] Exception calling ${modelName}:`, fetchErr.message);
      }
    }

    if (!response || !response.ok) {
      console.error('[Gemini API Server Error]: All models failed.', response?.status, lastErrorText);

      let userErrorMessage = "AURA is taking a moment. The travel assistant isn't available right now.";
      if (response?.status === 400 || response?.status === 401 || response?.status === 403) {
        userErrorMessage = "The Gemini API key in your .env file is invalid, expired, or unauthorized.";
      } else if (response?.status === 429) {
        userErrorMessage = "Gemini API rate limit exceeded. Please wait a moment before trying again.";
      }

      return res.status(response?.status || 500).json({
        error: 'GEMINI_HTTP_ERROR',
        userMessage: userErrorMessage
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (mode === 'itinerary') {
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      try {
        const parsed = JSON.parse(cleanJson);

        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.days) && parsed.days.length > 0) {
          const normalizedItinerary = {
            destination: parsed.destination || destinationContext?.city || 'Selected Destination',
            duration: Number(parsed.duration) || parsed.days.length || 5,
            tripTitle: parsed.tripTitle || `${parsed.destination || 'Bespoke'} Discovery`,
            days: parsed.days.map((d, index) => ({
              day: Number(d.day) || index + 1,
              title: d.title || `Day ${index + 1} Exploration`,
              activities: Array.isArray(d.activities)
                ? d.activities.map((act) => ({
                    time: act.time || 'Flexible',
                    title: act.title || 'Curated Place',
                    description: act.description || 'Discover local culture and atmosphere.',
                    location: act.location || 'Local Sanctum'
                  }))
                : []
            }))
          };
          return res.status(200).json({ mode: 'itinerary', data: normalizedItinerary });
        }
      } catch (parseErr) {
        console.warn('[AURA Serverless API] JSON Parse failed for itinerary, returning text:', parseErr.message);
      }
    }

    return res.status(200).json({
      mode: 'chat',
      reply: rawText || "Hi! I'm AURA, your global travel curator. Where would you like to explore?"
    });
  } catch (err) {
    console.error('[AURA Serverless API Exception]:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      userMessage: "AURA is taking a moment. The travel assistant isn't available right now."
    });
  }
}
