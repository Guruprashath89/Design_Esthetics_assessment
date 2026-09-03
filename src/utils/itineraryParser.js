/**
 * Safely parses string or object to extract structured itinerary data.
 * Handles raw JSON strings, Markdown code blocks (```json ... ```),
 * truncated JSON responses, and surrounding conversational text.
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

  // Quick check: must contain key itinerary indicators
  const lower = str.toLowerCase();
  const hasItineraryKeywords =
    lower.includes('"destination"') ||
    lower.includes('"triptitle"') ||
    lower.includes('"days"') ||
    (lower.includes('{') && lower.includes('"activities"'));

  if (!hasItineraryKeywords) return null;

  // Attempt 1: Direct JSON parsing (with fence cleaning)
  let candidate = extractJsonCandidate(str);
  try {
    const parsed = JSON.parse(candidate);
    const normalized = normalizeItineraryObject(parsed);
    if (normalized) return normalized;
  } catch {
    // Continue to repair attempts
  }

  // Attempt 2: Repair unescaped newlines & auto-close brackets
  try {
    const repaired = repairTruncatedJson(candidate);
    const parsed = JSON.parse(repaired);
    const normalized = normalizeItineraryObject(parsed);
    if (normalized) return normalized;
  } catch {
    // Continue to regex extraction
  }

  // Attempt 3: Regex fallback extraction for partial/truncated JSON
  try {
    const extracted = extractItineraryWithRegex(str);
    if (extracted) {
      const normalized = normalizeItineraryObject(extracted);
      if (normalized) return normalized;
    }
  } catch {
    // Return null if completely unparseable
  }

  return null;
}

function extractJsonCandidate(str) {
  let text = str.trim();

  // Strip Markdown code fences ```json ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  } else {
    // Find first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1).trim();
    } else if (firstBrace !== -1) {
      text = text.substring(firstBrace).trim();
    }
  }

  return text;
}

function repairTruncatedJson(jsonStr) {
  let s = jsonStr;

  // Fix literal unescaped newlines inside double quotes
  let inString = false;
  let escaped = false;
  let cleanStr = '';

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '"' && !escaped) {
      inString = !inString;
      cleanStr += char;
    } else if (inString && (char === '\n' || char === '\r')) {
      cleanStr += ' ';
    } else {
      cleanStr += char;
    }
    escaped = char === '\\' && !escaped;
  }

  s = cleanStr.trim();

  // Remove trailing comma before unclosed container
  s = s.replace(/,\s*$/, '');

  // Count unclosed brackets/braces/quotes
  inString = false;
  escaped = false;
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '"' && !escaped) {
      inString = !inString;
    } else if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}' && stack[stack.length - 1] === '{') {
        stack.pop();
      } else if (char === ']' && stack[stack.length - 1] === '[') {
        stack.pop();
      }
    }
    escaped = char === '\\' && !escaped;
  }

  if (inString) {
    s += '"';
  }

  s = s.replace(/,\s*$/, '');

  while (stack.length > 0) {
    const container = stack.pop();
    if (container === '{') s += '}';
    else if (container === '[') s += ']';
  }

  return s;
}

function extractItineraryWithRegex(str) {
  const destMatch = str.match(/"destination"\s*:\s*"([^"]+)"/i);
  const titleMatch = str.match(/"tripTitle"\s*:\s*"([^"]+)"/i);
  const durMatch = str.match(/"duration"\s*:\s*(\d+)/i);

  const destination = destMatch ? destMatch[1] : 'Destination';
  const tripTitle = titleMatch ? titleMatch[1] : `${destination} Journey`;
  const duration = durMatch ? parseInt(durMatch[1], 10) : 5;

  const days = [];
  const dayRegex = /"day"\s*:\s*(\d+)[\s\S]*?"title"\s*:\s*"([^"]+)"/g;
  let match;
  while ((match = dayRegex.exec(str)) !== null) {
    days.push({
      day: parseInt(match[1], 10),
      title: match[2],
      activities: []
    });
  }

  const actRegex = /"time"\s*:\s*"([^"]+)"[\s\S]*?"title"\s*:\s*"([^"]+)"(?:[\s\S]*?"description"\s*:\s*"([^"]+)")?(?:[\s\S]*?"location"\s*:\s*"([^"]+)")?/g;
  let actMatch;
  const activities = [];
  while ((actMatch = actRegex.exec(str)) !== null) {
    activities.push({
      time: actMatch[1] || 'Flexible',
      title: actMatch[2] || 'Sanctum Visit',
      description: actMatch[3] || '',
      location: actMatch[4] || ''
    });
  }

  if (days.length > 0 && activities.length > 0) {
    const perDay = Math.ceil(activities.length / days.length);
    days.forEach((d, idx) => {
      d.activities = activities.slice(idx * perDay, (idx + 1) * perDay);
    });
  } else if (days.length === 0 && activities.length > 0) {
    days.push({
      day: 1,
      title: 'Exploration & Sanctum Visit',
      activities
    });
  }

  if (days.length === 0) return null;

  return {
    destination,
    duration,
    tripTitle,
    days
  };
}

/**
 * Validates and normalizes an itinerary object into the expected schema
 */
function normalizeItineraryObject(obj) {
  if (!obj || typeof obj !== 'object') return null;

  const days = Array.isArray(obj.days) ? obj.days : null;
  if (!days || days.length === 0) return null;

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
