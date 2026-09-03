/**
 * Safely parses string or object to extract structured itinerary data.
 * Handles raw JSON strings, Markdown code blocks (```json ... ```), and surrounding text.
 */
export function parseItinerary(rawInput) {
  if (!rawInput) return null;

  // 1. If input is already an object
  if (typeof rawInput === 'object') {
    return normalizeItineraryObject(rawInput);
  }

  if (typeof rawInput !== 'string') return null;

  const str = rawInput.trim();
  if (!str) return null;

  // Quick check: string must contain JSON structural braces
  if (!str.includes('{') || !str.includes('}')) return null;

  try {
    let jsonCandidate = str;
    
    // Extract JSON block if wrapped in Markdown fences ```json ... ```
    const fenceMatch = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch && fenceMatch[1]) {
      jsonCandidate = fenceMatch[1].trim();
    } else {
      // Extract substring from first '{' to last '}'
      const firstBrace = str.indexOf('{');
      const lastBrace = str.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        jsonCandidate = str.substring(firstBrace, lastBrace + 1).trim();
      }
    }

    const parsed = JSON.parse(jsonCandidate);
    return normalizeItineraryObject(parsed);
  } catch {
    return null;
  }
}

/**
 * Validates and normalizes an itinerary object into the expected schema
 */
function normalizeItineraryObject(obj) {
  if (!obj || typeof obj !== 'object') return null;

  const days = Array.isArray(obj.days) ? obj.days : null;
  if (!days || days.length === 0) return null;

  // Ensure at least one day contains valid activities or title
  const hasValidDay = days.some(d => d && (d.title || Array.isArray(d.activities)));
  if (!hasValidDay) return null;

  return {
    destination: obj.destination || 'Selected Destination',
    duration: Number(obj.duration) || days.length || 5,
    tripTitle: obj.tripTitle || `${obj.destination || 'Bespoke'} Discovery`,
    days: days.map((d, dIdx) => ({
      day: Number(d.day) || dIdx + 1,
      title: d.title || `Day ${dIdx + 1} Exploration`,
      activities: Array.isArray(d.activities)
        ? d.activities.map((act) => ({
            time: act.time || 'Flexible',
            title: act.title || 'Curated Place',
            description: act.description || '',
            location: act.location || ''
          }))
        : []
    }))
  };
}
