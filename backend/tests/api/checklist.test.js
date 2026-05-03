/**
 * API Tests: POST /api/checklist
 */

const { request, app } = require('./setup');

describe('POST /api/checklist', () => {

  test('userType = first_time → 200 with correct items', async () => {
    const res = await request(app)
      .post('/api/checklist')
      .send({ userType: 'first_time' })
      .expect(200);

    expect(res.body.type).toBe('first_time');
    expect(res.body.title).toContain('First-Time');
    expect(res.body.items).toHaveLength(8);
    expect(res.body).toHaveProperty('sourceBadge', 'ECI Guidelines');
  });

  test('userType = registered → 200 with correct items', async () => {
    const res = await request(app)
      .post('/api/checklist')
      .send({ userType: 'registered' })
      .expect(200);

    expect(res.body.type).toBe('registered');
    expect(res.body.items).toHaveLength(6);
  });

  test('userType = polling_day → 200 with correct items', async () => {
    const res = await request(app)
      .post('/api/checklist')
      .send({ userType: 'polling_day' })
      .expect(200);

    expect(res.body.type).toBe('polling_day');
    expect(res.body.items).toHaveLength(8);
  });

  test('no body → 200 with default (first_time)', async () => {
    const res = await request(app)
      .post('/api/checklist')
      .send({})
      .expect(200);

    expect(res.body.type).toBe('first_time');
  });

  test('invalid userType → 400', async () => {
    await request(app)
      .post('/api/checklist')
      .send({ userType: 'invalid_type' })
      .expect(400);
  });

  test('items have id, task, priority', async () => {
    const res = await request(app)
      .post('/api/checklist')
      .send({ userType: 'first_time' })
      .expect(200);

    res.body.items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('task');
      expect(item).toHaveProperty('priority');
    });
  });
});
