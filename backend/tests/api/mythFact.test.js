/**
 * API Tests: POST /api/myth-fact
 */

const { request, app } = require('./setup');

describe('POST /api/myth-fact', () => {

  test('no body → 200 with all cards', async () => {
    const res = await request(app)
      .post('/api/myth-fact')
      .send({})
      .expect(200);

    expect(res.body).toHaveProperty('cards');
    expect(res.body.cards.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('sourceBadge', 'ECI Verified Data');
  });

  test('category filter → returns matching cards only', async () => {
    const res = await request(app)
      .post('/api/myth-fact')
      .send({ category: 'voting-process' })
      .expect(200);

    expect(res.body.cards.length).toBeGreaterThan(0);
    res.body.cards.forEach(card => {
      expect(card.category).toBe('voting-process');
    });
  });

  test('nonexistent category → 200 with empty cards', async () => {
    const res = await request(app)
      .post('/api/myth-fact')
      .send({ category: 'alien-voting' })
      .expect(200);

    expect(res.body.cards).toEqual([]);
  });

  test('each card has id, myth, fact, category', async () => {
    const res = await request(app)
      .post('/api/myth-fact')
      .send({})
      .expect(200);

    res.body.cards.forEach(card => {
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('myth');
      expect(card).toHaveProperty('fact');
      expect(card).toHaveProperty('category');
    });
  });

  test('invalid language → 400', async () => {
    await request(app)
      .post('/api/myth-fact')
      .send({ language: 'xx' })
      .expect(400);
  });
});
