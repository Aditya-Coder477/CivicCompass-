/**
 * Mock Data Validation Tests
 * Validates the in-memory mock data store structure and query helpers.
 */

const mockData = require('../../src/data/localMockData');

describe('Mock Data — Collections Exist', () => {

  test('journeyStages collection returns 6 stages', () => {
    const stages = mockData.getCollection('journeyStages');
    expect(stages).toHaveLength(6);
  });

  test('stateTimelines collection returns 10 state entries', () => {
    const timelines = mockData.getCollection('stateTimelines');
    expect(timelines).toHaveLength(10);
  });

  test('mythFacts collection returns 12 myth-fact pairs', () => {
    const myths = mockData.getCollection('mythFacts');
    expect(myths).toHaveLength(12);
  });

  test('checklistTemplates collection returns 3 templates', () => {
    const templates = mockData.getCollection('checklistTemplates');
    expect(templates).toHaveLength(3);
  });

  test('booths collection returns 12 booths', () => {
    const booths = mockData.getCollection('booths');
    expect(booths).toHaveLength(12);
  });
});

describe('Mock Data — Document Structure', () => {

  test('each journey stage has required fields', () => {
    const stages = mockData.getCollection('journeyStages');
    stages.forEach(stage => {
      expect(stage).toHaveProperty('index');
      expect(stage).toHaveProperty('label');
      expect(stage).toHaveProperty('icon');
      expect(stage).toHaveProperty('color');
      expect(stage).toHaveProperty('description');
      expect(stage).toHaveProperty('tips');
    });
  });

  test('each state timeline has required fields', () => {
    const timelines = mockData.getCollection('stateTimelines');
    timelines.forEach(t => {
      expect(t).toHaveProperty('state');
      expect(t).toHaveProperty('stateName');
      expect(t).toHaveProperty('notificationDate');
      expect(t).toHaveProperty('nominationDeadline');
      expect(t).toHaveProperty('lastWithdrawal');
      expect(t).toHaveProperty('pollDate');
      expect(t).toHaveProperty('resultDate');
      expect(t).toHaveProperty('pollProximityDays');
    });
  });

  test('each myth-fact card has required fields', () => {
    const myths = mockData.getCollection('mythFacts');
    myths.forEach(m => {
      expect(m).toHaveProperty('id');
      expect(m).toHaveProperty('myth');
      expect(m).toHaveProperty('fact');
      expect(m).toHaveProperty('category');
      expect(m.myth.length).toBeGreaterThan(0);
      expect(m.fact.length).toBeGreaterThan(0);
    });
  });

  test('each checklist template has type, title, items[]', () => {
    const templates = mockData.getCollection('checklistTemplates');
    templates.forEach(t => {
      expect(t).toHaveProperty('type');
      expect(t).toHaveProperty('title');
      expect(t).toHaveProperty('items');
      expect(Array.isArray(t.items)).toBe(true);
      expect(t.items.length).toBeGreaterThan(0);
    });
  });

  test('each booth has required fields', () => {
    const booths = mockData.getCollection('booths');
    booths.forEach(b => {
      expect(b).toHaveProperty('boothId');
      expect(b).toHaveProperty('name');
      expect(b).toHaveProperty('address');
      expect(b).toHaveProperty('district');
      expect(b).toHaveProperty('state');
      expect(b).toHaveProperty('lat');
      expect(b).toHaveProperty('lng');
      expect(typeof b.lat).toBe('number');
      expect(typeof b.lng).toBe('number');
    });
  });
});

describe('Mock Data — getDoc', () => {

  test('valid journey stage doc', () => {
    const doc = mockData.getDoc('journeyStages', 'stage_0');
    expect(doc).not.toBeNull();
    expect(doc.label).toBe('Eligibility Check');
  });

  test('valid state timeline doc', () => {
    const doc = mockData.getDoc('stateTimelines', 'delhi');
    expect(doc).not.toBeNull();
    expect(doc.stateName).toBe('Delhi');
  });

  test('valid checklist template doc', () => {
    const doc = mockData.getDoc('checklistTemplates', 'first_time');
    expect(doc).not.toBeNull();
    expect(doc.title).toContain('First-Time');
  });

  test('valid voting simulation doc', () => {
    const doc = mockData.getDoc('votingSimulation', 'votingSteps');
    expect(doc).not.toBeNull();
    expect(doc.steps).toHaveLength(6);
  });

  test('non-existent doc → returns null (not crash)', () => {
    expect(mockData.getDoc('journeyStages', 'stage_999')).toBeNull();
    expect(mockData.getDoc('stateTimelines', 'mars')).toBeNull();
    expect(mockData.getDoc('checklistTemplates', 'x')).toBeNull();
  });

  test('non-existent collection → returns null', () => {
    expect(mockData.getDoc('fakeCollection', 'anyDoc')).toBeNull();
  });
});

describe('Mock Data — getCollection', () => {

  test('non-existent collection → returns []', () => {
    const result = mockData.getCollection('nonexistent');
    expect(result).toEqual([]);
  });

  test('filter by category works for mythFacts', () => {
    const filtered = mockData.getCollection('mythFacts', [['category', '==', 'voting-process']]);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(m => {
      expect(m.category).toBe('voting-process');
    });
  });

  test('filter by district works for booths', () => {
    const filtered = mockData.getCollection('booths', [['district', '==', 'central delhi']]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].boothId).toBe('DL001');
  });

  test('filter by state works for booths', () => {
    const filtered = mockData.getCollection('booths', [['state', '==', 'delhi']]);
    expect(filtered).toHaveLength(2);
  });

  test('filter with no matches → empty array', () => {
    const result = mockData.getCollection('booths', [['district', '==', 'nonexistent']]);
    expect(result).toEqual([]);
  });
});
