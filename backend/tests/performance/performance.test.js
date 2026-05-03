/**
 * Performance Tests
 * Validates response times and concurrent request handling.
 */

const { evaluateEligibility } = require('../../src/engine/eligibility');
const { calculateStage, getStageInfo } = require('../../src/engine/journeyEngine');
const { getNextSteps } = require('../../src/engine/nextStepEngine');
const { getChecklist } = require('../../src/engine/checklistEngine');
const { getTimeline } = require('../../src/engine/timelineEngine');
const { findBooth } = require('../../src/engine/boothEngine');

// Mock Gemini for API tests
jest.mock('../../src/services/geminiService', () => ({
  explain: jest.fn().mockResolvedValue('Mocked fast response'),
}));

const request = require('supertest');
const app = require('../../server');

describe('Performance — Rule Engine Functions', () => {

  test('evaluateEligibility completes in < 5ms', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      evaluateEligibility({ age: 25, citizen: true });
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 1000;
    expect(perCall).toBeLessThan(5);
  });

  test('calculateStage completes in < 5ms', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      calculateStage({ age: 25, registered: true, verified: true, pollProximityDays: 15 });
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 1000;
    expect(perCall).toBeLessThan(5);
  });

  test('getNextSteps completes in < 5ms', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      getNextSteps({ age: 25, registered: true, verified: true, pollProximityDays: 10 });
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 1000;
    expect(perCall).toBeLessThan(5);
  });

  test('getStageInfo completes in < 5ms', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      getStageInfo(3);
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 1000;
    expect(perCall).toBeLessThan(5);
  });
});

describe('Performance — Async Engines (Mock Data)', () => {

  test('getTimeline completes in < 10ms', async () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      await getTimeline('delhi');
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 100;
    expect(perCall).toBeLessThan(10);
  });

  test('getChecklist completes in < 10ms', async () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      await getChecklist({ userType: 'first_time' });
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 100;
    expect(perCall).toBeLessThan(10);
  });

  test('findBooth completes in < 10ms', async () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      await findBooth('central delhi', '', '');
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 100;
    expect(perCall).toBeLessThan(10);
  });
});

describe('Performance — API Endpoints', () => {

  test('POST /api/next-steps responds in < 200ms', async () => {
    const start = performance.now();
    await request(app)
      .post('/api/next-steps')
      .send({ age: 22, registered: true })
      .expect(200);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  test('POST /api/checklist responds in < 200ms', async () => {
    const start = performance.now();
    await request(app)
      .post('/api/checklist')
      .send({ userType: 'first_time' })
      .expect(200);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  test('POST /api/simulate-voting responds in < 200ms', async () => {
    const start = performance.now();
    await request(app)
      .post('/api/simulate-voting')
      .send({})
      .expect(200);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  test('GET /health responds in < 50ms', async () => {
    const start = performance.now();
    await request(app).get('/health').expect(200);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });
});

describe('Performance — Concurrent Requests', () => {

  test('50 concurrent /api/next-steps requests do not crash', async () => {
    const promises = Array.from({ length: 50 }, () =>
      request(app)
        .post('/api/next-steps')
        .send({ age: 22, registered: true, verified: false, pollProximityDays: 50 })
    );

    const results = await Promise.all(promises);
    results.forEach(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('steps');
    });
  });

  test('50 concurrent /api/booth-locator requests do not crash', async () => {
    const promises = Array.from({ length: 50 }, () =>
      request(app)
        .post('/api/booth-locator')
        .send({ state: 'delhi' })
    );

    const results = await Promise.all(promises);
    results.forEach(res => {
      expect(res.status).toBe(200);
    });
  });
});
