/**
 * Unit Tests: Eligibility Engine
 * Tests deterministic rule-based eligibility evaluation.
 * Gemini must NOT override these decisions.
 */

const { evaluateEligibility } = require('../../src/engine/eligibility');

describe('Eligibility Engine', () => {

  // ─── Basic eligible / not-eligible ───────────────────────────────────────────

  test('age >= 18 and citizen → eligible', () => {
    const result = evaluateEligibility({ age: 25, citizen: true });
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('meet');
  });

  test('age = 18 boundary → eligible', () => {
    const result = evaluateEligibility({ age: 18 });
    expect(result.eligible).toBe(true);
  });

  test('age = 17 → not eligible', () => {
    const result = evaluateEligibility({ age: 17 });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('18');
  });

  test('age < 18 → not eligible', () => {
    const result = evaluateEligibility({ age: 10 });
    expect(result.eligible).toBe(false);
  });

  test('non-citizen → not eligible', () => {
    const result = evaluateEligibility({ age: 25, citizen: false });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Indian citizens');
  });

  // ─── Edge cases ──────────────────────────────────────────────────────────────

  test('age = 0 → not eligible', () => {
    const result = evaluateEligibility({ age: 0 });
    expect(result.eligible).toBe(false);
  });

  test('age = 150 → eligible (no upper bound in rules)', () => {
    const result = evaluateEligibility({ age: 150 });
    expect(result.eligible).toBe(true);
  });

  test('age undefined → not eligible with reason', () => {
    const result = evaluateEligibility({});
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('Age not provided.');
  });

  test('age null → not eligible with reason', () => {
    const result = evaluateEligibility({ age: null });
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('Age not provided.');
  });

  test('citizen defaults to true when not provided', () => {
    const result = evaluateEligibility({ age: 25 });
    expect(result.eligible).toBe(true);
  });

  // ─── Determinism ─────────────────────────────────────────────────────────────

  test('same input always produces same output (deterministic)', () => {
    const profile = { age: 22, citizen: true };
    const r1 = evaluateEligibility(profile);
    const r2 = evaluateEligibility(profile);
    const r3 = evaluateEligibility(profile);
    expect(r1).toEqual(r2);
    expect(r2).toEqual(r3);
  });

  // ─── Return structure ────────────────────────────────────────────────────────

  test('result always contains eligible (boolean) and reason (string)', () => {
    const eligible = evaluateEligibility({ age: 30 });
    expect(typeof eligible.eligible).toBe('boolean');
    expect(typeof eligible.reason).toBe('string');
    expect(eligible.reason.length).toBeGreaterThan(0);

    const notEligible = evaluateEligibility({ age: 5 });
    expect(typeof notEligible.eligible).toBe('boolean');
    expect(typeof notEligible.reason).toBe('string');
    expect(notEligible.reason.length).toBeGreaterThan(0);
  });
});
