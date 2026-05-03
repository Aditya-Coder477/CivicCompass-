/**
 * API Tests: POST /api/timeline
 */

const { request, app } = require('./setup');

describe('POST /api/timeline', () => {

  test('valid state → 200 with timeline data', async () => {
    const res = await request(app)
      .post('/api/timeline')
      .send({ state: 'delhi' })
      .expect(200);

    expect(res.body).toHaveProperty('timeline');
    expect(res.body.timeline).toHaveProperty('events');
    expect(res.body.timeline.events).toHaveLength(5);
    expect(res.body).toHaveProperty('geminiSummary');
    expect(res.body).toHaveProperty('sourceBadge', 'ECI Official Data');
  });

  test('unknown state → 200 with fallback timeline', async () => {
    const res = await request(app)
      .post('/api/timeline')
      .send({ state: 'mars' })
      .expect(200);

    expect(res.body.timeline.isFallback).toBe(true);
  });

  test('missing state → 400', async () => {
    await request(app)
      .post('/api/timeline')
      .send({})
      .expect(400);
  });

  test('invalid language → 400', async () => {
    await request(app)
      .post('/api/timeline')
      .send({ state: 'delhi', language: 'fr' })
      .expect(400);
  });

  test('each event has event, date, description', async () => {
    const res = await request(app)
      .post('/api/timeline')
      .send({ state: 'maharashtra' })
      .expect(200);

    res.body.timeline.events.forEach(event => {
      expect(event).toHaveProperty('event');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('description');
    });
  });
});
