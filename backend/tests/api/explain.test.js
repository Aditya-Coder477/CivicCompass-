/**
 * API Tests: POST /api/explain
 */

const { request, app } = require('./setup');

describe('POST /api/explain', () => {

  test('valid content → 200 with explanation', async () => {
    const res = await request(app)
      .post('/api/explain')
      .send({ content: 'You need to register to vote in India.' })
      .expect(200);

    expect(res.body).toHaveProperty('explanation');
    expect(res.body).toHaveProperty('style');
    expect(res.body).toHaveProperty('language');
    expect(res.body).toHaveProperty('sourceBadge', 'Simplified');
  });

  test('missing content → 400', async () => {
    await request(app)
      .post('/api/explain')
      .send({ style: 'eli5' })
      .expect(400);
  });

  test('empty content → 400', async () => {
    await request(app)
      .post('/api/explain')
      .send({ content: '' })
      .expect(400);
  });

  test('content exceeding 2000 chars → 400', async () => {
    const longContent = 'x'.repeat(2001);
    await request(app)
      .post('/api/explain')
      .send({ content: longContent })
      .expect(400);
  });

  test('invalid style → 400', async () => {
    await request(app)
      .post('/api/explain')
      .send({ content: 'Test', style: 'nonexistent' })
      .expect(400);
  });

  test('invalid language → 400', async () => {
    await request(app)
      .post('/api/explain')
      .send({ content: 'Test', language: 'zz' })
      .expect(400);
  });

  test('valid style and language → 200', async () => {
    const res = await request(app)
      .post('/api/explain')
      .send({ content: 'Test content', style: 'eli5', language: 'hi' })
      .expect(200);

    expect(res.body.style).toBe('eli5');
    expect(res.body.language).toBe('hi');
  });
});
