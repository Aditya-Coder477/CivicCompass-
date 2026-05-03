/**
 * API Setup — shared by all API test files.
 * Configures supertest with the Express app.
 * Mocks Gemini to avoid real API calls during API tests.
 */

// Mock Gemini before loading app
jest.mock('../../src/services/geminiService', () => ({
  explain: jest.fn().mockResolvedValue('Mocked Gemini explanation for testing.'),
}));

const request = require('supertest');
const app = require('../../server');

module.exports = { request, app };
