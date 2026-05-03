/**
 * Frontend Unit Tests: API Client
 * Validates the API client helper functions (non-UI tests).
 */

// Mock fetch globally
global.fetch = jest.fn();

// We need to import the module using require because it uses ES export
// and we need to handle the module system difference
describe('API Client', () => {

  beforeEach(() => {
    fetch.mockReset();
  });

  test('api.journey calls /api/journey with POST', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stage: { index: 1 } }),
    });

    // Dynamic import to handle ESM
    const { api } = await import('../src/lib/api');
    await api.journey({ age: 22 });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/api/journey');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  test('api.checklist sends correct body', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });

    const { api } = await import('../src/lib/api');
    await api.checklist('first_time', 'en', false);

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.userType).toBe('first_time');
    expect(body.language).toBe('en');
  });

  test('api throws on non-ok response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Bad request' }),
    });

    const { api } = await import('../src/lib/api');
    await expect(api.journey({ age: -1 })).rejects.toThrow('Bad request');
  });

  test('api handles network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { api } = await import('../src/lib/api');
    await expect(api.journey({ age: 22 })).rejects.toThrow('Network error');
  });

  test('api.boothLocator sends district, state, pincode', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ booth: {} }),
    });

    const { api } = await import('../src/lib/api');
    await api.boothLocator('central delhi', 'Delhi', '110005');

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.district).toBe('central delhi');
    expect(body.state).toBe('Delhi');
    expect(body.pincode).toBe('110005');
  });

  test('api.simulateVoting sends empty body', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ steps: [] }),
    });

    const { api } = await import('../src/lib/api');
    await api.simulateVoting();

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body).toEqual({});
  });
});
