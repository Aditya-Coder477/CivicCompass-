/**
 * constants.js — Frontend shared constants.
 *
 * All hardcoded UI strings, arrays, and configuration values that were
 * previously defined inline inside component functions are centralized here.
 * This keeps components clean and makes values reusable and easy to update.
 */

/** Ordered list of all Indian states for dropdowns. */
export const STATES = [
  'Delhi',
  'Maharashtra',
  'Gujarat',
  'Karnataka',
  'Rajasthan',
  'Uttar Pradesh',
  'Tamil Nadu',
  'West Bengal',
  'Punjab',
  'Andhra Pradesh',
  'Haryana',
];

/** The 6 colors corresponding to each journey stage (index-matched). */
export const STAGE_COLORS = [
  '#6366F1', // Eligibility
  '#3B82F6', // Registration
  '#0EA5E9', // Roll Verification
  '#F97316', // Polling Day Prep
  '#10B981', // Voting
  '#F59E0B', // Counting & Results
];

/** Emoji icons for each journey stage (index-matched). */
export const STAGE_ICONS = ['🛡️', '📝', '🔍', '📋', '🗳️', '📊'];

/** Short labels for the stage stepper in the journey progress bar. */
export const STAGE_STEPPER_LABELS = [
  'Eligibility',
  'Register',
  'Verify',
  'Prep',
  'Vote',
  'Results',
];

/** The total number of journey stages. */
export const TOTAL_STAGES = 6;

/**
 * Explanation style options for the Gemini language layer.
 * Displayed as toggle buttons on the Journey page.
 */
export const EXPLAIN_STYLES = [
  { id: 'summary',  label: '30-sec Summary' },
  { id: 'eli5',     label: 'Simple Language' },
  { id: 'official', label: 'Official Steps' },
  { id: 'today',    label: 'What to do Today' },
];

/** Colors used to style simulation step progress indicators (index-matched). */
export const STEP_COLORS = [
  '#6366F1',
  '#3B82F6',
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#F97316',
];

/** Emoji icons for each simulation voting step (index-matched). */
export const STEP_ICONS = ['🚪', '🖊️', '📄', '👆', '🧾', '🎉'];
