/**
 * Journey Engine
 * Calculates which of the 6 stages a user is currently in.
 * Purely deterministic — Gemini does not influence this.
 */

const STAGE_LABELS = [
  'Eligibility Check',
  'Registration',
  'Roll Verification',
  'Polling Day Prep',
  'Voting',
  'Counting & Results',
];

function calculateStage(profile) {
  const { age = 0, registered = false, verified = false, pollProximityDays = 999 } = profile;
  if (age < 18) return 0;
  if (!registered) return 1;
  if (!verified) return 2;
  if (pollProximityDays > 30) return 3;
  if (pollProximityDays > 0) return 4;
  return 5;
}

function getStageInfo(index) {
  return {
    index,
    label: STAGE_LABELS[index] || 'Unknown',
    totalStages: STAGE_LABELS.length,
    progressPercent: Math.round((index / (STAGE_LABELS.length - 1)) * 100),
  };
}

module.exports = { calculateStage, getStageInfo, STAGE_LABELS };
