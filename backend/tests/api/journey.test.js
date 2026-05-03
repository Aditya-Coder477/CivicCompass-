/**
 * API Tests: POST /api/journey
 */

const { request, app } = require('./setup');

describe('POST /api/journey', () => {

  test('valid request → 200 with full journey response', async () => {
    const res = await request(app)
      .post('/api/journey')
      .send({ age: 25, registered: true, verified: true, pollProximityDays: 20 })
      .expect(200);

    expect(res.body).toHaveProperty('eligibility');
    expect(res.body.eligibility.eligible).toBe(true);
    expect(res.body).toHaveProperty('stage');
    expect(res.body.stage).toHaveProperty('index');
    expect(res.body.stage).toHaveProperty('label');
    expect(res.body.stage).toHaveProperty('progressPercent');
    expect(res.body).toHaveProperty('stageDetails');
    expect(res.body).toHaveProperty('geminiExplanation');
    expect(res.body).toHaveProperty('sourceBadge');
    expect(res.body.sourceBadge).toBe('ECI Guidelines');
  });

  test('age < 18 → eligible = false, stage 0', async () => {
    const res = await request(app)
      .post('/api/journey')
      .send({ age: 15 })
      .expect(200);

    expect(res.body.eligibility.eligible).toBe(false);
    expect(res.body.stage.index).toBe(0);
  });

  test('missing age → 400 validation error', async () => {
    const res = await request(app)
      .post('/api/journey')
      .send({ registered: true })
      .expect(400);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  test('age out of range (negative) → 400', async () => {
    await request(app)
      .post('/api/journey')
      .send({ age: -5 })
      .expect(400);
  });

  test('age out of range (> 120) → 400', async () => {
    await request(app)
      .post('/api/journey')
      .send({ age: 200 })
      .expect(400);
  });

  test('invalid language → 400', async () => {
    await request(app)
      .post('/api/journey')
      .send({ age: 25, language: 'xx' })
      .expect(400);
  });

  test('invalid style → 400', async () => {
    await request(app)
      .post('/api/journey')
      .send({ age: 25, style: 'invalid' })
      .expect(400);
  });

  test('valid language and style → 200', async () => {
    await request(app)
      .post('/api/journey')
      .send({ age: 25, language: 'hi', style: 'eli5' })
      .expect(200);
  });
});
