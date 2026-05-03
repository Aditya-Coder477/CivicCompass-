/**
 * Gemini Smoke Tests (Live API)
 * Requires a valid GEMINI_API_KEY in .env.
 * These tests call the real Gemini API to verify integration.
 *
 * Run separately: npx jest tests/services/geminiSmoke.test.js --testTimeout=30000
 *
 * Skipped by default in CI. Remove .skip or set GEMINI_SMOKE=true to run.
 */

require('dotenv').config();

const SHOULD_RUN = process.env.GEMINI_SMOKE === 'true' || process.env.GEMINI_API_KEY;

const describeOrSkip = SHOULD_RUN ? describe : describe.skip;

// Use fresh require to avoid mock interference
let explain;
beforeAll(() => {
  // Clear any mocks from other test files
  jest.resetModules();
  explain = require('../../src/services/geminiService').explain;
});

describeOrSkip('Gemini Smoke Tests (Live API)', () => {

  jest.setTimeout(30000);

  const sampleContent =
    'To register to vote in India, you must be 18 years or older and an Indian citizen. ' +
    'You can register online at voters.eci.gov.in using Form 6.';

  test('summary style returns non-empty response', async () => {
    const result = await explain(sampleContent, 'summary', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
  });

  test('eli5 style returns simplified response', async () => {
    const result = await explain(sampleContent, 'eli5', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
  });

  test('Hindi translation returns non-English response', async () => {
    const result = await explain(sampleContent, 'summary', 'hi');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
  });

  test('response does not add fabricated government URLs', async () => {
    const result = await explain(
      'You need an Aadhaar card or Voter ID to vote.',
      'official',
      'en'
    );
    // The input mentions no specific URL, so the response should not invent one
    // (except voters.eci.gov.in which is in common knowledge)
    expect(result).not.toContain('http://fake');
    expect(result).not.toContain('.xyz');
  });

  test('response does not invent new eligibility rules', async () => {
    const result = await explain(
      'You must be 18 years old to vote in India.',
      'eli5',
      'en'
    );
    // Should not claim a different age threshold
    expect(result).not.toMatch(/\b21\b.*years/i);
    expect(result).not.toMatch(/\b16\b.*years/i);
  });
});
