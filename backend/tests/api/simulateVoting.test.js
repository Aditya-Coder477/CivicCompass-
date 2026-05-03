/**
 * API Tests: POST /api/simulate-voting
 */

const { request, app } = require('./setup');

describe('POST /api/simulate-voting', () => {

  test('returns 200 with 6 simulation steps', async () => {
    const res = await request(app)
      .post('/api/simulate-voting')
      .send({})
      .expect(200);

    expect(res.body).toHaveProperty('steps');
    expect(res.body.steps).toHaveLength(6);
    expect(res.body).toHaveProperty('totalSteps', 6);
    expect(res.body).toHaveProperty('sourceBadge', 'ECI Official Data');
  });

  test('each step has step number, title, description', async () => {
    const res = await request(app)
      .post('/api/simulate-voting')
      .send({})
      .expect(200);

    res.body.steps.forEach((step, i) => {
      expect(step).toHaveProperty('step', i + 1);
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('icon');
      expect(step).toHaveProperty('tip');
    });
  });

  test('steps are in sequential order', async () => {
    const res = await request(app)
      .post('/api/simulate-voting')
      .send({})
      .expect(200);

    for (let i = 0; i < res.body.steps.length; i++) {
      expect(res.body.steps[i].step).toBe(i + 1);
    }
  });
});
