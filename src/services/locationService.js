import { DESTINATIONS } from '../data/destinationsData';

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getCurrentUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        denied: true,
        message: "Location access isn't available. You can still explore anywhere in the world."
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find nearest destination from our curated 12-destination dataset
        let nearest = null;
        let minDistance = Infinity;

        DESTINATIONS.forEach((dest) => {
          const dist = calculateDistance(latitude, longitude, dest.latitude, dest.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = dest;
          }
        });

        resolve({
          denied: false,
          latitude,
          longitude,
          nearestDestination: nearest,
          distanceKm: Math.round(minDistance)
        });
      },
      (error) => {
        // Log diagnostic error to console only, return customer-ready message
        console.warn('[AURA Geolocation Warning] Code:', error.code, error.message);
        reject({
          denied: true,
          message: "Location access isn't available. You can still explore anywhere in the world."
        });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}
