/**
 * Security Tests
 * Validates that the application is secure against common vulnerabilities.
 */

const fs = require('fs');
const path = require('path');

// Mock Gemini for API tests
jest.mock('../../src/services/geminiService', () => ({
  explain: jest.fn().mockResolvedValue('Mocked'),
}));

const request = require('supertest');
const app = require('../../server');

describe('Security — API Key Exposure', () => {

  test('GEMINI_API_KEY is NOT in any frontend file', () => {
    const frontendDir = path.join(__dirname, '..', '..', '..', 'frontend', 'src');
    if (!fs.existsSync(frontendDir)) {
      console.warn('Frontend directory not found, skipping frontend file scan.');
      return;
    }

    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '.next') continue;
          scanDir(fullPath);
        } else if (entry.name.match(/\.(js|jsx|ts|tsx|json|env)$/)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Check for actual API key pattern (AIza...) or literal env reference
          expect(content).not.toMatch(/AIzaSy[A-Za-z0-9_-]{33}/);
          // GEMINI_API_KEY should only appear in .env.example as a placeholder
          if (!entry.name.includes('.example')) {
            expect(content).not.toContain('GEMINI_API_KEY');
          }
        }
      }
    }

    scanDir(frontendDir);
  });

  test('backend .env is not shipped with frontend', () => {
    const frontendPublic = path.join(__dirname, '..', '..', '..', 'frontend', 'public');
    if (fs.existsSync(frontendPublic)) {
      const files = fs.readdirSync(frontendPublic);
      expect(files).not.toContain('.env');
    }
  });
});

describe('Security — Input Sanitization', () => {

  test('XSS in state field is escaped', async () => {
    const res = await request(app)
      .post('/api/timeline')
      .send({ state: '<script>alert("xss")</script>' })
      .expect(200);

    // express-validator escape() should have sanitized the input
    const body = JSON.stringify(res.body);
    expect(body).not.toContain('<script>');
  });

  test('XSS in district field is escaped', async () => {
    const res = await request(app)
      .post('/api/booth-locator')
      .send({ district: '<img onerror=alert(1) src=x>' })
      .expect(200);

    const body = JSON.stringify(res.body);
    expect(body).not.toContain('<img');
  });

  test('SQL injection attempt in content field does not crash', async () => {
    const res = await request(app)
      .post('/api/explain')
      .send({ content: "'; DROP TABLE users; --" })
      .expect(200);

    expect(res.body).toHaveProperty('explanation');
  });

  test('extremely long input is rejected', async () => {
    const longContent = 'A'.repeat(5000);
    await request(app)
      .post('/api/explain')
      .send({ content: longContent })
      .expect(400);
  });
});

describe('Security — Error Handling', () => {

  test('404 endpoint → proper JSON error', async () => {
    const res = await request(app)
      .get('/api/nonexistent')
      .expect(404);

    expect(res.body).toHaveProperty('error', 'Endpoint not found');
  });

  test('error response does not leak stack traces', async () => {
    const res = await request(app)
      .get('/api/nonexistent')
      .expect(404);

    expect(JSON.stringify(res.body)).not.toContain('at ');
    expect(JSON.stringify(res.body)).not.toContain('node_modules');
  });
});

describe('Security — Helmet Headers', () => {

  test('response includes security headers from Helmet', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);

    // Helmet sets these by default
    expect(res.headers).toHaveProperty('x-content-type-options');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});

describe('Security — Request Size Limit', () => {

  test('JSON body > 10kb is rejected', async () => {
    const bigBody = { content: 'x'.repeat(11000) };
    const res = await request(app)
      .post('/api/explain')
      .send(bigBody);

    // Either 400 (validation) or 413 (payload too large)
    expect([400, 413]).toContain(res.status);
  });
});
