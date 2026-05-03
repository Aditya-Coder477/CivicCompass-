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
  return {
    boothId: booth.boothId,
    name: booth.name,
    address: booth.address,
    distance: booth.distance,
    travelTime: booth.travelTime,
    coordinates: { lat: booth.lat, lng: booth.lng },
  };
}

module.exports = { findBooth };
