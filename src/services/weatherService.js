/**
 * AURA Weather Service
 * Calls server-side /api/weather endpoint to keep API keys secure.
 * Features in-memory caching (10-min TTL) to prevent redundant API calls.
 */

const weatherCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function fetchLiveWeather(cityQuery, lat, lon, forceRefresh = false) {
  const cacheKey = (lat && lon) ? `${lat.toFixed(2)},${lon.toFixed(2)}` : (cityQuery || '').toLowerCase().trim();

  // Return cached result if valid and not forcing refresh
  if (!forceRefresh && cacheKey && weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  try {
    let url = '/api/weather?';
    if (lat && lon) {
      url += `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    } else if (cityQuery) {
      url += `city=${encodeURIComponent(cityQuery.trim())}`;
    } else {
      throw new Error('City or coordinates required.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.error) {
      const errMsg = data.error || `Weather service returned HTTP status ${response.status}`;
      throw new Error(errMsg);
    }

    // Save normalized weather data to cache
    if (cacheKey) {
      weatherCache.set(cacheKey, {
        timestamp: Date.now(),
        data
      });
    }

    return data;
  } catch (err) {
    console.warn('[AURA Weather Service] Weather request failed:', err.message || err);
    throw err;
  }
}
