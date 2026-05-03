/**
 * geminiPromptBuilder.js — Dedicated service for constructing Gemini prompts.
 *
 * All prompt strings are defined here, not scattered through route files or
 * geminiService.js. This gives the AI explanation layer a clear, testable
 * boundary separate from the rule engine and data layer.
 *
 * PHASE 1 CONSTRAINT: Gemini is ONLY used to rephrase/translate content
 * produced by the deterministic rule engine. It NEVER influences logic decisions.
 */

/**
 * Builds a prompt for explaining a voter's current journey stage.
 * @param {string} stageLabel - Name of the stage (e.g. "Registration")
 * @param {string} description - Stage description text
 * @param {string} tips - Tips associated with the stage
 * @returns {string} Prompt string ready to send to Gemini
 */
function buildJourneyPrompt(stageLabel, description, tips) {
  return (
    `You are at stage "${stageLabel}". ${description} Tip: ${tips}`
  );
}

/**
 * Builds a prompt for summarising an election timeline.
 * @param {string} stateName - Name of the state
 * @param {string} eventsSummary - Multi-line string of timeline events
 * @returns {string} Prompt string ready to send to Gemini
 */
function buildTimelinePrompt(stateName, eventsSummary) {
  return `Election timeline for ${stateName}:\n${eventsSummary}`;
}

/**
 * Builds a prompt for translating a checklist item.
 * @param {string} task - The checklist task text
 * @returns {string} Prompt string ready to send to Gemini
 */
function buildChecklistItemPrompt(task) {
  return task;
}

/**
 * Builds prompts for translating a myth-fact card.
 * @param {string} myth - The myth text
 * @param {string} fact - The fact text
 * @returns {{ mythPrompt: string, factPrompt: string }}
 */
function buildMythFactPrompts(myth, fact) {
  return {
    mythPrompt: `Myth: ${myth}`,
    factPrompt: `Fact: ${fact}`,
  };
}

/**
 * Builds a prompt for the direct explain endpoint.
 * @param {string} content - Raw content to rephrase
 * @returns {string} Prompt string ready to send to Gemini
 */
function buildExplainPrompt(content) {
  return content;
}

module.exports = {
  buildJourneyPrompt,
  buildTimelinePrompt,
  buildChecklistItemPrompt,
  buildMythFactPrompts,
  buildExplainPrompt,
};
