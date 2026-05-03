/**
 * Next Step Engine
 * Returns the top 3 most relevant next actions for a user.
 * Rule-based only — Gemini must not change these decisions.
 */

const ALL_STEPS = [
  { id: 'check_eligibility', title: 'Confirm Your Age & Citizenship', description: 'Verify you are 18+ and an Indian citizen — both are required to vote.', icon: 'shield-check', priority: 10, condition: p => p.age < 18 },
  { id: 'register', title: 'Register on the Voter Roll', description: 'Apply online at voters.eci.gov.in using Form 6 to get added to the electoral list.', icon: 'user-plus', priority: 10, condition: p => p.age >= 18 && !p.registered },
  { id: 'verify_roll', title: 'Verify Your Name on Voter List', description: 'Search for your name on the electoral roll to confirm your registration is active.', icon: 'search', priority: 9, condition: p => p.registered && !p.verified },
  { id: 'find_booth', title: 'Find Your Polling Booth', description: 'Look up the exact booth assigned to your address using the Booth Locator.', icon: 'map-pin', priority: 8, condition: p => p.verified && p.pollProximityDays <= 60 },
  { id: 'download_slip', title: 'Download Your Voter Slip', description: 'Get your voter information slip from voters.eci.gov.in to carry on polling day.', icon: 'download', priority: 7, condition: p => p.verified && p.pollProximityDays <= 30 },
  { id: 'prepare_id', title: 'Prepare a Valid Photo ID', description: 'Keep your Aadhaar, Passport, PAN, or Driving License ready for polling day.', icon: 'credit-card', priority: 7, condition: p => p.verified && p.pollProximityDays <= 30 },
  { id: 'plan_travel', title: 'Plan Your Travel to the Booth', description: 'Know the route and estimated time to reach your polling booth on election day.', icon: 'navigation', priority: 6, condition: p => p.verified && p.pollProximityDays <= 14 },
  { id: 'know_candidates', title: 'Learn About Your Candidates', description: 'Review the candidate list for your constituency before voting.', icon: 'users', priority: 5, condition: p => p.verified && p.pollProximityDays <= 14 },
  { id: 'check_queue', title: 'Check Live Queue at Booth', description: 'Plan the best time to vote by checking estimated queues at your booth.', icon: 'clock', priority: 6, condition: p => p.verified && p.pollProximityDays <= 3 && p.pollProximityDays > 0 },
  { id: 'results_ready', title: 'Watch the Election Results', description: 'Results are typically declared within 24–48 hours. Follow official ECI channels.', icon: 'bar-chart', priority: 5, condition: p => p.pollProximityDays <= 0 },
];

function getNextSteps(profile) {
  const relevant = ALL_STEPS
    .filter(s => s.condition(profile))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map(({ id, title, description, icon }) => ({ id, title, description, icon }));

  if (relevant.length === 0) {
    return [{ id: 'all_done', title: 'You Are All Set!', description: 'You have completed all preparation steps. Get ready to vote!', icon: 'check-circle' }];
  }
  return relevant;
}

module.exports = { getNextSteps };
