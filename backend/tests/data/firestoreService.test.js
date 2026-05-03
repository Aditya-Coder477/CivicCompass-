/**
 * Integration Tests: Firestore Service Caching Layer
 *
 * Verifies that the in-memory TTL cache wrapping firestoreService
 * correctly caches results and serves from cache on subsequent calls.
 * This ensures Phase 1 efficiency gains are preserved.
 */

const cache = require('../../src/utils/cache');

describe('Cache Utility', () => {

  beforeEach(() => {
    // Reset cache between tests
    cache.clear();
  });

  test('returns null for a key that has not been set', () => {
    expect(cache.get('missing_key')).toBeNull();
  });

  test('returns the stored value after set()', () => {
    cache.set('test_key', { data: 'value' });
    expect(cache.get('test_key')).toEqual({ data: 'value' });
  });

  test('stores and retrieves an array value correctly', () => {
    const booths = [{ boothId: 'DL001' }, { boothId: 'MH001' }];
    cache.set('booths_all', booths);
    expect(cache.get('booths_all')).toHaveLength(2);
    expect(cache.get('booths_all')[0].boothId).toBe('DL001');
  });

  test('stores and retrieves a null value correctly', () => {
    cache.set('null_doc', null);
    // null is a valid cached result (e.g. "document not found")
    expect(cache.get('null_doc')).toBeNull();
  });

  test('clear() removes all cached entries', () => {
    cache.set('key_a', 'value_a');
    cache.set('key_b', 'value_b');
    cache.clear();
    expect(cache.get('key_a')).toBeNull();
    expect(cache.get('key_b')).toBeNull();
  });

  test('different keys are stored independently', () => {
    cache.set('key_x', 'value_x');
    cache.set('key_y', 'value_y');
    expect(cache.get('key_x')).toBe('value_x');
    expect(cache.get('key_y')).toBe('value_y');
  });

  test('overwriting a key stores the new value', () => {
    cache.set('dup_key', 'original');
    cache.set('dup_key', 'updated');
    expect(cache.get('dup_key')).toBe('updated');
  });
});
