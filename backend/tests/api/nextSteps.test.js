/**
 * API Tests: POST /api/next-steps
 */

const { request, app } = require('./setup');

describe('POST /api/next-steps', () => {

  test('valid request → 200 with steps array', async () => {
    const res = await request(app)
      .post('/api/next-steps')
      .send({ age: 22, registered: false })
      .expect(200);

    expect(res.body).toHaveProperty('steps');
    expect(Array.isArray(res.body.steps)).toBe(true);
    expect(res.body.steps.length).toBeLessThanOrEqual(3);
    expect(res.body.steps.length).toBeGreaterThanOrEqual(1);
    expect(res.body).toHaveProperty('sourceBadge');
  });

  test('steps never exceed 3', async () => {
    const res = await request(app)
      .post('/api/next-steps')
      .send({ age: 30, registered: true, verified: true, pollProximityDays: 5 })
      .expect(200);

    expect(res.body.steps.length).toBeLessThanOrEqual(3);
  });

  test('missing age → 400', async () => {
    await request(app)
      .post('/api/next-steps')
      .send({ registered: true })
      .expect(400);
  });

  test('each step has id, title, description, icon', async () => {
    const res = await request(app)
      .post('/api/next-steps')
      .send({ age: 22 })
      .expect(200);

    res.body.steps.forEach(step => {
      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('icon');
    });
  });

  test('sourceBadge is always present', async () => {
    const res = await request(app)
      .post('/api/next-steps')
      .send({ age: 22 })
      .expect(200);

    expect(res.body.sourceBadge).toBe('ECI Guidelines');
  });
});
