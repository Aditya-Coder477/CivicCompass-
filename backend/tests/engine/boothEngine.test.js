/**
 * Unit Tests: Booth Engine
 * Tests polling booth lookup with district/state/fallback logic.
 * Uses in-memory mock data.
 */

const { findBooth } = require('../../src/engine/boothEngine');

describe('Booth Engine', () => {

  // ─── District match ───────────────────────────────────────────────────────────

  test('valid district returns matching booth', async () => {
    const booth = await findBooth('central delhi', '', '');
    expect(booth).not.toBeNull();
    expect(booth.boothId).toBe('DL001');
    expect(booth.name).toContain('Sarvodaya');
  });

  test('district match is case-insensitive', async () => {
    const booth = await findBooth('Central Delhi', '', '');
    expect(booth).not.toBeNull();
    expect(booth.boothId).toBe('DL001');
  });

  // ─── State fallback ──────────────────────────────────────────────────────────

  test('no district match → falls back to state match', async () => {
    const booth = await findBooth('nonexistent', '', 'karnataka');
    expect(booth).not.toBeNull();
    expect(booth.boothId).toBe('KA001');
  });

  test('state match works when district is empty', async () => {
    const booth = await findBooth('', '', 'maharashtra');
    expect(booth).not.toBeNull();
    expect(booth.boothId).toBe('MH001');
  });

  // ─── Global fallback ─────────────────────────────────────────────────────────

  test('no district or state match → returns first available booth', async () => {
    const booth = await findBooth('zzz_nonexistent', '', 'zzz_nonexistent');
    expect(booth).not.toBeNull();
    expect(booth.boothId).toBeTruthy();
  });

  test('all empty strings → returns first available booth (global fallback)', async () => {
    const booth = await findBooth('', '', '');
    expect(booth).not.toBeNull();
  });

  // ─── Response structure ───────────────────────────────────────────────────────

  test('booth response has correct structure', async () => {
    const booth = await findBooth('central delhi', '', '');
    expect(booth).toHaveProperty('boothId');
    expect(booth).toHaveProperty('name');
    expect(booth).toHaveProperty('address');
    expect(booth).toHaveProperty('distance');
    expect(booth).toHaveProperty('travelTime');
    expect(booth).toHaveProperty('coordinates');
    expect(booth.coordinates).toHaveProperty('lat');
    expect(booth.coordinates).toHaveProperty('lng');
    expect(typeof booth.coordinates.lat).toBe('number');
    expect(typeof booth.coordinates.lng).toBe('number');
  });

  // ─── Multiple districts ──────────────────────────────────────────────────────

  test('pune district → pune booth', async () => {
    const booth = await findBooth('pune', '', '');
    expect(booth.boothId).toBe('MH002');
  });

  test('bangalore urban district → Karnataka booth', async () => {
    const booth = await findBooth('bangalore urban', '', '');
    expect(booth.boothId).toBe('KA001');
  });

  // ─── Determinism ──────────────────────────────────────────────────────────────

  test('same input always returns same booth', async () => {
    const r1 = await findBooth('central delhi', '', '');
    const r2 = await findBooth('central delhi', '', '');
    expect(r1).toEqual(r2);
  });
});
