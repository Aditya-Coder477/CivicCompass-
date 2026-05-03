/**
 * firestoreService.js
 *
 * When USE_LOCAL_DATA=true (or NODE_ENV=development without GCP credentials),
 * this module uses the in-memory localMockData instead of Firestore.
 * On Cloud Run (production) it uses real Firestore with ADC.
 */

const USE_LOCAL = process.env.USE_LOCAL_DATA === 'true' || process.env.NODE_ENV === 'development';
if (USE_LOCAL) console.log('[FirestoreService] Using local mock data (USE_LOCAL_DATA=true or development mode).');

const cache = require('../utils/cache');


let _local = null;
function local() {
  if (!_local) _local = require('../data/localMockData');
  return _local;
}

let _db = null;
function getDb() {
  if (_db) return _db;
  try {
    const { Firestore } = require('@google-cloud/firestore');
    _db = new Firestore({ projectId: process.env.GCP_PROJECT_ID || 'civiccompass-495119' });
  } catch (e) {
    console.warn('[FirestoreService] Failed to load Firestore, will use local data:', e.message);
    _db = null;
  }
  return _db;
}

async function getDoc(collection, docId) {
  const cacheKey = `doc_${collection}_${docId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let result = null;
  if (USE_LOCAL) {
    result = local().getDoc(collection, docId);
  } else {
    const db = getDb();
    if (!db) {
      console.warn('[FirestoreService] Firestore unavailable, falling back to local data.');
      result = local().getDoc(collection, docId);
    } else {
      try {
        const ref = db.collection(collection).doc(docId);
        const snap = await ref.get();
        result = snap.exists ? { id: snap.id, ...snap.data() } : null;
      } catch (err) {
        console.warn(`[Firestore] falling back to local data: ${err.message}`);
        result = local().getDoc(collection, docId);
      }
    }
  }

  cache.set(cacheKey, result);
  return result;
}

async function getCollection(collection, filters = []) {
  const cacheKey = `coll_${collection}_${JSON.stringify(filters)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let result = [];
  if (USE_LOCAL) {
    result = local().getCollection(collection, filters);
  } else {
    const db = getDb();
    if (!db) {
      console.warn('[FirestoreService] Firestore unavailable, falling back to local data.');
      result = local().getCollection(collection, filters);
    } else {
      try {
        let ref = db.collection(collection);
        filters.forEach(([f, op, val]) => { ref = ref.where(f, op, val); });
        const snap = await ref.get();
        result = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.warn(`[Firestore] falling back to local data: ${err.message}`);
        result = local().getCollection(collection, filters);
      }
    }
  }

  cache.set(cacheKey, result);
  return result;
}

async function setDoc(collection, docId, data) {
  if (USE_LOCAL) {
    console.log(`[LocalMock] setDoc ${collection}/${docId} (no-op in local mode)`);
    return;
  }
  await getDb().collection(collection).doc(docId).set(data, { merge: true });
}

module.exports = { getDoc, getCollection, setDoc };
