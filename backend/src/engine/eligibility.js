/**
 * Eligibility Engine
 * Deterministic rule-based eligibility evaluation.
 * Gemini must NOT override these decisions.
 */

function evaluateEligibility(profile) {
  const { age, citizen = true } = profile;
  if (age === undefined || age === null) return { eligible: false, reason: 'Age not provided.' };
  if (age < 18) return { eligible: false, reason: `You must be 18 years or older to vote. You are currently ${age}.` };
  if (!citizen) return { eligible: false, reason: 'Only Indian citizens are eligible to vote.' };
  return { eligible: true, reason: 'You meet the basic eligibility criteria to vote in India.' };
}

module.exports = { evaluateEligibility };
