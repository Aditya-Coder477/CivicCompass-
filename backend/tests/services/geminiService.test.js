/**
 * Gemini Service Tests (Mocked)
 * Validates that the Gemini service constructs correct prompts,
 * handles failures gracefully, and never introduces new facts.
 */

// Mock the Google Generative AI module before requiring geminiService
const mockGenerateContent = jest.fn();
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}));

// Set env before requiring module
process.env.GEMINI_API_KEY = 'test-key-mock';

const { explain } = require('../../src/services/geminiService');

describe('Gemini Service — Mocked', () => {

  beforeEach(() => {
    mockGenerateContent.mockReset();
  });

  // ─── Prompt construction ──────────────────────────────────────────────────────

  test('sends correct prompt with content included', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Rephrased content' },
    });

    await explain('Test content about voting', 'summary', 'en');

    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('Test content about voting');
    expect(call).toContain('Do NOT add any facts');
  });

  test('summary style prompt includes "30-second summary"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Summary' },
    });

    await explain('Content', 'summary', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('30-second summary');
  });

  test('eli5 style prompt includes "12-year-old"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Simple' },
    });

    await explain('Content', 'eli5', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('12-year-old');
  });

  test('official style prompt includes "official-style"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Official' },
    });

    await explain('Content', 'official', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('official-style');
  });

  test('today style prompt includes "most important action"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Today action' },
    });

    await explain('Content', 'today', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('most important action');
  });

  // ─── Language mapping ─────────────────────────────────────────────────────────

  test('language "en" → prompt says "English"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'EN' },
    });

    await explain('Content', 'summary', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('English');
  });

  test('language "hi" → prompt says "Hindi"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'HI' },
    });

    await explain('Content', 'summary', 'hi');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('Hindi');
  });

  test('unknown language → defaults to "English"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Default' },
    });

    await explain('Content', 'summary', 'xx');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('English');
  });

  // ─── Return value ─────────────────────────────────────────────────────────────

  test('returns Gemini response text trimmed', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => '  Rephrased content  ' },
    });

    const result = await explain('Content', 'summary', 'en');
    expect(result).toBe('Rephrased content');
  });

  // ─── Graceful fallback on error ───────────────────────────────────────────────

  test('Gemini API failure → returns original content unchanged', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'));

    const original = 'This is the original election guidance.';
    const result = await explain(original, 'summary', 'en');
    expect(result).toBe(original);
  });

  test('Gemini timeout → returns original content', async () => {
    mockGenerateContent.mockRejectedValue(new Error('DEADLINE_EXCEEDED'));

    const original = 'Original content here.';
    const result = await explain(original, 'eli5', 'en');
    expect(result).toBe(original);
  });

  // ─── Safety: no facts injection ───────────────────────────────────────────────

  test('prompt always includes "Do NOT add any facts not present"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Rephrased' },
    });

    await explain('Any content', 'summary', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('Do NOT add any facts not present');
  });

  test('prompt always includes "Do NOT mention sources"', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Rephrased' },
    });

    await explain('Any content', 'summary', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('Do NOT mention sources');
  });

  // ─── Unknown style fallback ───────────────────────────────────────────────────

  test('unknown style → defaults to summary style', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Fallback' },
    });

    await explain('Content', 'unknown_style', 'en');
    const call = mockGenerateContent.mock.calls[0][0];
    expect(call).toContain('30-second summary');
  });
});
