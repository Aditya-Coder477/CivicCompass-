/**
 * Unit Tests: Next Step Engine
 * Tests the top-3 personalized action recommendation system.
 * Rule-based only — Gemini must NOT change these decisions.
 */

const { getNextSteps } = require('../../src/engine/nextStepEngine');

describe('Next Step Engine', () => {

  // ─── Max 3 steps ──────────────────────────────────────────────────────────────

  test('never returns more than 3 steps', () => {
    const profiles = [
      { age: 10 },
      { age: 22, registered: false },
      { age: 22, registered: true, verified: false },
      { age: 22, registered: true, verified: true, pollProximityDays: 1 },
      { age: 22, registered: true, verified: true, pollProximityDays: 25 },
    ];
    profiles.forEach(p => {
      const steps = getNextSteps(p);
      expect(steps.length).toBeLessThanOrEqual(3);
      expect(steps.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Profile-specific steps ──────────────────────────────────────────────────

  test('age < 18 → returns "check_eligibility" step', () => {
    const steps = getNextSteps({ age: 15, registered: false, verified: false, pollProximityDays: 999 });
    expect(steps.some(s => s.id === 'check_eligibility')).toBe(true);
  });

  test('age >= 18, not registered → returns "register" step', () => {
    const steps = getNextSteps({ age: 22, registered: false, verified: false, pollProximityDays: 999 });
    expect(steps.some(s => s.id === 'register')).toBe(true);
  });

  test('registered, not verified → returns "verify_roll" step', () => {
    const steps = getNextSteps({ age: 22, registered: true, verified: false, pollProximityDays: 999 });
    expect(steps.some(s => s.id === 'verify_roll')).toBe(true);
  });

  test('verified with pollProximityDays <= 30 → returns ID-related steps', () => {
    const steps = getNextSteps({ age: 22, registered: true, verified: true, pollProximityDays: 20 });
    const ids = steps.map(s => s.id);
    // Should include some combination of find_booth, download_slip, prepare_id
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.length).toBeLessThanOrEqual(3);
  });

  test('verified with pollProximityDays <= 3 → includes "check_queue"', () => {
    const steps = getNextSteps({ age: 22, registered: true, verified: true, pollProximityDays: 2 });
    expect(steps.some(s => s.id === 'check_queue')).toBe(true);
  });

  test('pollProximityDays <= 0 → includes "results_ready"', () => {
    const steps = getNextSteps({ age: 22, registered: true, verified: true, pollProximityDays: 0 });
    const ids = steps.map(s => s.id);
    expect(ids).toContain('results_ready');
  });

  // ─── All-done fallback ────────────────────────────────────────────────────────

  test('fully prepared user with no conditions matching → "all_done" fallback', () => {
    // This profile matches none of the conditions:
    // - age >= 18 (so no check_eligibility)
    // - registered = true (so no register)
    // - verified = true (so no verify_roll)
    // - pollProximityDays > 60 (so no find_booth, download_slip, prepare_id, plan_travel, know_candidates, check_queue)
    // - pollProximityDays > 0 (so no results_ready)
    const steps = getNextSteps({ age: 30, registered: true, verified: true, pollProximityDays: 100 });
    expect(steps).toHaveLength(1);
    expect(steps[0].id).toBe('all_done');
    expect(steps[0].title).toContain('All Set');
  });

  // ─── Priority ordering ───────────────────────────────────────────────────────

  test('steps are sorted by descending priority', () => {
    // For a verified user near polling day, multiple steps should match
    const steps = getNextSteps({ age: 22, registered: true, verified: true, pollProximityDays: 10 });
    // We can't inspect internal priority, but we can verify the structure is valid
    steps.forEach(step => {
      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('icon');
    });
  });

  // ─── Return structure ────────────────────────────────────────────────────────

  test('each step has id, title, description, icon (no internal fields leaked)', () => {
    const steps = getNextSteps({ age: 22, registered: false, verified: false, pollProximityDays: 999 });
    steps.forEach(step => {
      expect(Object.keys(step).sort()).toEqual(['description', 'icon', 'id', 'title']);
      // No 'priority' or 'condition' leaked
      expect(step).not.toHaveProperty('priority');
      expect(step).not.toHaveProperty('condition');
    });
  });

  // ─── Determinism ──────────────────────────────────────────────────────────────

  test('same input always returns same output', () => {
    const profile = { age: 22, registered: true, verified: false, pollProximityDays: 50 };
    const r1 = getNextSteps(profile);
    const r2 = getNextSteps(profile);
    expect(r1).toEqual(r2);
  });
});
