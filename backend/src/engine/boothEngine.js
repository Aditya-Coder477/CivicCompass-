const { getCollection } = require('../services/firestoreService');

async function findBooth(district = '', pincode = '', state = '') {
  const districtKey = district.toLowerCase().trim();
  const stateKey = state.toLowerCase().replace(/\s+/g, '');

  let booths = [];

  // Try district match first
  if (districtKey) {
    booths = await getCollection('booths', [['district', '==', districtKey]]);
  }

  // Fallback: try state match
  if (booths.length === 0 && stateKey) {
    booths = await getCollection('booths', [['state', '==', stateKey]]);
  }

  // Fallback: return first available booth
  if (booths.length === 0) {
    booths = await getCollection('booths');
  }

  if (booths.length === 0) return null;

  // Return the first matching booth (mock deterministic behavior)
  const booth = booths[0];
  let lat = booth.lat;
  let lng = booth.lng;

  // Fallback to Geocoding API if coordinates are missing
  if (lat === undefined || lng === undefined) {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY is not set');
      
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(booth.address)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
      } else {
        console.warn('[boothEngine] Geocoding failed:', data.status);
      }
    } catch (err) {
      console.warn('[boothEngine] Error calling Geocoding API:', err.message);
    }
  }

  return {
    boothId: booth.boothId,
    name: booth.name,
    address: booth.address,
    distance: booth.distance || 'Unknown',
    travelTime: booth.travelTime || 'Unknown',
    coordinates: lat !== undefined && lng !== undefined ? { lat, lng } : null,
  };
}

module.exports = { findBooth };
