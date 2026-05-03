/**
 * Unit Tests: Journey Engine
 * Tests stage calculation and stage info generation.
 * Purely deterministic — Gemini does not influence this.
 */

const { calculateStage, getStageInfo, STAGE_LABELS } = require('../../src/engine/journeyEngine');

describe('Journey Engine — calculateStage', () => {

  test('age < 18 → stage 0 (Eligibility Check)', () => {
    expect(calculateStage({ age: 15 })).toBe(0);
  });

  test('age >= 18, not registered → stage 1 (Registration)', () => {
    expect(calculateStage({ age: 22, registered: false })).toBe(1);
  });

  test('registered but not verified → stage 2 (Roll Verification)', () => {
    expect(calculateStage({ age: 22, registered: true, verified: false })).toBe(2);
  });

  test('verified, pollProximityDays > 30 → stage 3 (Polling Day Prep)', () => {
    expect(calculateStage({ age: 22, registered: true, verified: true, pollProximityDays: 45 })).toBe(3);
  });

  test('verified, 0 < pollProximityDays <= 30 → stage 4 (Voting)', () => {
    expect(calculateStage({ age: 22, registered: true, verified: true, pollProximityDays: 15 })).toBe(4);
    expect(calculateStage({ age: 22, registered: true, verified: true, pollProximityDays: 1 })).toBe(4);
  });

  test('pollProximityDays <= 0 → stage 5 (Counting & Results)', () => {
    expect(calculateStage({ age: 22, registered: true, verified: true, pollProximityDays: 0 })).toBe(5);
    expect(calculateStage({ age: 22, registered: true, verified: true, pollProximityDays: -5 })).toBe(5);
  });

  // ─── Boundary conditions ─────────────────────────────────────────────────────

  test('pollProximityDays = 31 → stage 3', () => {
    expect(calculateStage({ age: 20, registered: true, verified: true, pollProximityDays: 31 })).toBe(3);
  });

  test('pollProximityDays = 30 → stage 3 (> 30 check is strict)', () => {
    // The code says `pollProximityDays > 30` for stage 3, so 30 should NOT hit stage 3
    // and `pollProximityDays > 0` for stage 4, so 30 > 0 → stage 4
    expect(calculateStage({ age: 20, registered: true, verified: true, pollProximityDays: 30 })).toBe(4);
  });

  test('defaults: age=0, registered=false → stage 0', () => {
    expect(calculateStage({})).toBe(0);
  });

  test('defaults: pollProximityDays=999 when not provided → stage 3', () => {
    expect(calculateStage({ age: 25, registered: true, verified: true })).toBe(3);
  });

  // ─── Determinism ──────────────────────────────────────────────────────────────

  test('same profile always returns same stage', () => {
    const profile = { age: 30, registered: true, verified: true, pollProximityDays: 10 };
    expect(calculateStage(profile)).toBe(calculateStage(profile));
  });
});

describe('Journey Engine — getStageInfo', () => {

  test('returns correct label for each stage index', () => {
    expect(getStageInfo(0).label).toBe('Eligibility Check');
    expect(getStageInfo(1).label).toBe('Registration');
    expect(getStageInfo(2).label).toBe('Roll Verification');
    expect(getStageInfo(3).label).toBe('Polling Day Prep');
    expect(getStageInfo(4).label).toBe('Voting');
    expect(getStageInfo(5).label).toBe('Counting & Results');
  });

  test('totalStages is always 6', () => {
    for (let i = 0; i < 6; i++) {
      expect(getStageInfo(i).totalStages).toBe(6);
    }
  });

  test('progressPercent for stage 0 is 0%', () => {
    expect(getStageInfo(0).progressPercent).toBe(0);
  });

  test('progressPercent for stage 5 is 100%', () => {
    expect(getStageInfo(5).progressPercent).toBe(100);
  });

  test('progressPercent increases monotonically', () => {
    let prev = -1;
    for (let i = 0; i < 6; i++) {
      const pct = getStageInfo(i).progressPercent;
      expect(pct).toBeGreaterThan(prev);
      prev = pct;
    }
  });

  test('unknown index → label "Unknown"', () => {
    expect(getStageInfo(99).label).toBe('Unknown');
  });
});

describe('Journey Engine — STAGE_LABELS', () => {
  test('has exactly 6 labels', () => {
    expect(STAGE_LABELS).toHaveLength(6);
  });

  test('all labels are non-empty strings', () => {
    STAGE_LABELS.forEach(label => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });
});
