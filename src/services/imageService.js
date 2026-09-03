/**
 * Dynamic Image Service via Unsplash API / CDN
 * Fetches dynamic photos based on destination search query.
 */

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export async function fetchDynamicImage(query, fallbackUrl) {
  if (UNSPLASH_KEY && UNSPLASH_KEY.trim() !== '') {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return {
            url: data.results[0].urls.regular || data.results[0].urls.full,
            photographer: data.results[0].user.name,
            photographerUrl: data.results[0].user.links.html,
            alt: data.results[0].alt_description || query
          };
        }
      }
    } catch (err) {
      console.warn('[AURA Image Service] Unsplash API search request failed:', err);
    }
  }

  // Remote high-res Unsplash CDN fallback URL
  return {
    url: fallbackUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop`,
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    alt: query
  };
}
