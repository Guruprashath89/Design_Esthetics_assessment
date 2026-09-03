import fs from 'fs';
import path from 'path';

function getApiKey() {
  let apiKey =
    process.env.OPENWEATHER_API_KEY ||
    process.env.VITE_OPENWEATHER_API_KEY ||
    process.env.OPENWEATHER_KEY;

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
          if (
            (keyName === 'OPENWEATHER_API_KEY' ||
              keyName === 'VITE_OPENWEATHER_API_KEY' ||
              keyName === 'OPENWEATHER_KEY') &&
            val &&
            val !== 'your_key_here'
          ) {
            apiKey = val;
            break;
          }
        }
      }
    } catch {
      // Ignore filesystem errors in serverless environments
    }
  }

  return apiKey ? apiKey.trim() : null;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    return res.status(401).json({
      error: 'Weather service unconfigured. Please set a valid OPENWEATHER_API_KEY in your .env file.'
    });
  }

  const { city, lat, lon } = req.query || {};

  // Comprehensive city & region to OpenWeather location mapping
  const cityCountryMap = {
    'kyoto': 'Kyoto,JP',
    'paris': 'Paris,FR',
    'tokyo': 'Tokyo,JP',
    'dubai': 'Dubai,AE',
    'london': 'London,GB',
    'new york': 'New York,US',
    'bali': 'Denpasar,ID',
    'ubud & bali coast': 'Denpasar,ID',
    'sydney': 'Sydney,AU',
    'cape town': 'Cape Town,ZA',
    'rome': 'Rome,IT',
    'amalfi coast': 'Amalfi,IT',
    'amalfi': 'Amalfi,IT',
    'reykjavik': 'Reykjavik,IS',
    'reykjavik & golden circle': 'Reykjavik,IS',
    'bangkok': 'Bangkok,TH',
    'barcelona': 'Barcelona,ES',
    'istanbul': 'Istanbul,TR',
    'marrakech': 'Marrakech,MA',
    'seoul': 'Seoul,KR',
    'singapore': 'Singapore,SG',
    'rio de janeiro': 'Rio de Janeiro,BR',
    'auckland': 'Auckland,NZ',
    'santorini': 'Thira,GR'
  };

  let targetQuery = (city || '').trim();
  const lowerQuery = targetQuery.toLowerCase();
  if (cityCountryMap[lowerQuery]) {
    targetQuery = cityCountryMap[lowerQuery];
  }

  let apiUrl = '';
  if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${apiKey}`;
  } else if (targetQuery) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(targetQuery)}&units=metric&appid=${apiKey}`;
  } else {
    return res.status(400).json({ error: 'City or coordinates parameter is required.' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({
          error: 'The OpenWeather API key is invalid or inactive. Please check your OPENWEATHER_API_KEY in .env.'
        });
      }
      if (response.status === 404) {
        return res.status(404).json({
          error: `Weather data not found for location "${targetQuery}".`
        });
      }
      return res.status(response.status).json({
        error: 'Live weather service could not process request for this destination.'
      });
    }

    const data = await response.json();

    // Convert wind speed from m/s to km/h (1 m/s = 3.6 km/h)
    const windSpeedKmH = data.wind?.speed ? Math.round(data.wind.speed * 3.6) : 0;

    // Clean normalized weather payload
    const normalizedData = {
      city: data.name || city || 'Destination',
      country: data.sys?.country || '',
      temp: Math.round(data.main?.temp ?? 20),
      feelsLike: Math.round(data.main?.feels_like ?? 20),
      condition: data.weather?.[0]?.main || 'Clear',
      description: data.weather?.[0]?.description || 'clear sky',
      humidity: data.main?.humidity ?? 50,
      windSpeed: windSpeedKmH,
      icon: data.weather?.[0]?.icon || '01d'
    };

    return res.status(200).json(normalizedData);
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return res.status(504).json({
      error: isTimeout
        ? 'Weather request timed out.'
        : 'Live meteorological connection could not be established.'
    });
  }
}
