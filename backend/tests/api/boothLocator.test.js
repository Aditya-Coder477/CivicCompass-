/**
 * API Tests: POST /api/booth-locator
 */

const { request, app } = require('./setup');

describe('POST /api/booth-locator', () => {

  test('valid district → 200 with booth', async () => {
    const res = await request(app)
      .post('/api/booth-locator')
      .send({ district: 'central delhi' })
      .expect(200);

    expect(res.body).toHaveProperty('booth');
    expect(res.body.booth).toHaveProperty('boothId');
    expect(res.body.booth).toHaveProperty('name');
    expect(res.body.booth).toHaveProperty('address');
    expect(res.body.booth).toHaveProperty('coordinates');
    expect(res.body).toHaveProperty('sourceBadge', 'ECI Verified Data');
  });

  test('valid state → 200 with booth', async () => {
    const res = await request(app)
      .post('/api/booth-locator')
      .send({ state: 'karnataka' })
      .expect(200);

    expect(res.body.booth.boothId).toBe('KA001');
  });

  test('empty body → 200 with fallback booth', async () => {
    const res = await request(app)
      .post('/api/booth-locator')
      .send({})
      .expect(200);

    expect(res.body).toHaveProperty('booth');
    expect(res.body.booth.boothId).toBeTruthy();
  });

  test('booth has distance and travelTime', async () => {
    const res = await request(app)
      .post('/api/booth-locator')
      .send({ district: 'pune' })
      .expect(200);

    expect(res.body.booth).toHaveProperty('distance');
    expect(res.body.booth).toHaveProperty('travelTime');
  });
});
