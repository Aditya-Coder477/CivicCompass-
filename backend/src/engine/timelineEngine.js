const { getDoc } = require('../services/firestoreService');

async function getTimeline(state) {
  const key = (state || '').toLowerCase().replace(/\s+/g, '');
  const doc = await getDoc('stateTimelines', key);
  if (!doc) {
    return {
      state: 'Unknown',
      events: [],
      note: 'No mock timeline available for this state yet. Showing sample data.',
      isFallback: true,
    };
  }
  const events = [
    { event: 'Election Notification', date: doc.notificationDate, description: 'Official election schedule is announced by the Election Commission of India.' },
    { event: 'Nomination Deadline', date: doc.nominationDeadline, description: 'Last date for candidates to file their nomination papers.' },
    { event: 'Last Day for Withdrawal', date: doc.lastWithdrawal, description: 'Candidates who wish to withdraw their nomination must do so by this date.' },
    { event: 'Poll Date', date: doc.pollDate, description: 'Voting day! Polling booths are open from 7 AM to 6 PM.' },
    { event: 'Result Date', date: doc.resultDate, description: 'Votes are counted and winners are declared by the Election Commission.' },
  ];
  return { state: doc.stateName, pollProximityDays: doc.pollProximityDays, events, isFallback: false };
}

module.exports = { getTimeline };
