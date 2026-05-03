const { getDoc } = require('../services/firestoreService');

function resolveUserType(profile) {
  if (profile.userType) return profile.userType;
  if (!profile.registered) return 'first_time';
  return 'registered';
}

async function getChecklist(profile) {
  const type = resolveUserType(profile);
  const doc = await getDoc('checklistTemplates', type);
  if (!doc) return { type, title: 'Voter Checklist', items: [] };
  return { type: doc.type, title: doc.title, items: doc.items };
}

module.exports = { getChecklist };
