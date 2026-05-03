/**
 * Unit Tests: Timeline Engine
 * Tests timeline generation from mock Firestore data.
 * Deterministic — no Gemini involvement.
 */

const { getTimeline } = require('../../src/engine/timelineEngine');

describe('Timeline Engine', () => {

  // ─── Valid states ─────────────────────────────────────────────────────────────

  const validStates = [
    'delhi', 'maharashtra', 'gujarat', 'karnataka', 'rajasthan',
    'up', 'tamilnadu', 'westbengal', 'punjab', 'andhrapradesh',
  ];

  test.each(validStates)('state "%s" returns valid timeline with 5 events', async (state) => {
    const result = await getTimeline(state);
    expect(result.isFallback).toBe(false);
    expect(result.events).toHaveLength(5);
    expect(result.state).toBeTruthy();
  });

  test('Delhi timeline has correct event names', async () => {
    const result = await getTimeline('delhi');
    const eventNames = result.events.map(e => e.event);
    expect(eventNames).toEqual([
      'Election Notification',
      'Nomination Deadline',
      'Last Day for Withdrawal',
      'Poll Date',
      'Result Date',
    ]);
  });

  // ─── Event structure ──────────────────────────────────────────────────────────

  test('each event has event, date, description fields', async () => {
    const result = await getTimeline('delhi');
    result.events.forEach(event => {
      expect(event).toHaveProperty('event');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('description');
      expect(typeof event.event).toBe('string');
      expect(typeof event.date).toBe('string');
      expect(typeof event.description).toBe('string');
    });
  });

  // ─── Fallback ─────────────────────────────────────────────────────────────────

  test('unknown state → fallback with empty events', async () => {
    const result = await getTimeline('nonexistent_state');
    expect(result.isFallback).toBe(true);
    expect(result.events).toEqual([]);
    expect(result.state).toBe('Unknown');
  });

  test('empty string → fallback', async () => {
    const result = await getTimeline('');
    expect(result.isFallback).toBe(true);
  });

  test('null state → fallback', async () => {
    const result = await getTimeline(null);
    expect(result.isFallback).toBe(true);
  });

  test('undefined state → fallback', async () => {
    const result = await getTimeline(undefined);
    expect(result.isFallback).toBe(true);
  });

  // ─── Case / whitespace normalization ──────────────────────────────────────────

  test('state with mixed case → still matches', async () => {
    const result = await getTimeline('Delhi');
    // The engine lowercases and strips spaces, but 'Delhi' → 'delhi' should work
    expect(result.isFallback).toBe(false);
  });

  test('state with spaces → normalized', async () => {
    // 'andhra pradesh' would become 'andhrapradesh' after replace(/\s+/g, '')
    const result = await getTimeline('andhra pradesh');
    expect(result.isFallback).toBe(false);
    expect(result.state).toBe('Andhra Pradesh');
  });

  // ─── pollProximityDays ────────────────────────────────────────────────────────

  test('result includes pollProximityDays when state is valid', async () => {
    const result = await getTimeline('delhi');
    expect(typeof result.pollProximityDays).toBe('number');
  });

  // ─── Determinism ──────────────────────────────────────────────────────────────

  test('same state always returns same timeline', async () => {
    const r1 = await getTimeline('maharashtra');
    const r2 = await getTimeline('maharashtra');
    expect(r1).toEqual(r2);
  });
});
