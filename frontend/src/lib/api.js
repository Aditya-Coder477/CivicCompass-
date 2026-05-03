const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  journey: (profile) => post('/api/journey', profile),
  nextSteps: (profile) => post('/api/next-steps', profile),
  timeline: (state, language = 'en') => post('/api/timeline', { state, language }),
  explain: (content, style, language) => post('/api/explain', { content, style, language }),
  mythFact: (language = 'en', category) => post('/api/myth-fact', { language, category }),
  checklist: (userType, language = 'en', registered = false) => post('/api/checklist', { userType, language, registered }),
  boothLocator: (district, state, pincode) => post('/api/booth-locator', { district, state, pincode }),
  simulateVoting: () => post('/api/simulate-voting', {}),
};
