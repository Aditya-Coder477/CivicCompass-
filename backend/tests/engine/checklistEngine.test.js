/**
 * Unit Tests: Checklist Engine
 * Tests checklist generation based on user type.
 * Deterministic — driven entirely by mock data.
 */

const { getChecklist } = require('../../src/engine/checklistEngine');

describe('Checklist Engine', () => {

  // ─── Explicit user types ──────────────────────────────────────────────────────

  test('userType = "first_time" → 8 items', async () => {
    const result = await getChecklist({ userType: 'first_time' });
    expect(result.type).toBe('first_time');
    expect(result.title).toBe('First-Time Voter Checklist');
    expect(result.items).toHaveLength(8);
  });

  test('userType = "registered" → 6 items', async () => {
    const result = await getChecklist({ userType: 'registered' });
    expect(result.type).toBe('registered');
    expect(result.title).toBe('Already Registered Voter Checklist');
    expect(result.items).toHaveLength(6);
  });

  test('userType = "polling_day" → 8 items', async () => {
    const result = await getChecklist({ userType: 'polling_day' });
    expect(result.type).toBe('polling_day');
    expect(result.title).toBe('Polling Day Checklist');
    expect(result.items).toHaveLength(8);
  });

  // ─── Auto-resolution from profile ─────────────────────────────────────────────

  test('no userType + registered: false → resolves to "first_time"', async () => {
    const result = await getChecklist({ registered: false });
    expect(result.type).toBe('first_time');
  });

  test('no userType + registered: true → resolves to "registered"', async () => {
    const result = await getChecklist({ registered: true });
    expect(result.type).toBe('registered');
  });

  // ─── Fallback ─────────────────────────────────────────────────────────────────

  test('unknown userType → returns empty items array', async () => {
    const result = await getChecklist({ userType: 'nonexistent_type' });
    expect(result.items).toEqual([]);
  });

  // ─── Item structure ───────────────────────────────────────────────────────────

  test('each item has id, task, priority', async () => {
    const result = await getChecklist({ userType: 'first_time' });
    result.items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('task');
      expect(item).toHaveProperty('priority');
      expect(typeof item.task).toBe('string');
      expect(['high', 'medium', 'low']).toContain(item.priority);
    });
  });

  // ─── Determinism ──────────────────────────────────────────────────────────────

  test('same input always returns same checklist', async () => {
    const r1 = await getChecklist({ userType: 'first_time' });
    const r2 = await getChecklist({ userType: 'first_time' });
    expect(r1).toEqual(r2);
  });
});
