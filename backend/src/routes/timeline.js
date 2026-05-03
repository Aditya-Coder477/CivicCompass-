/**
 * Route: POST /api/timeline
 *
 * Returns the election timeline for a given Indian state along with a
 * Gemini-simplified summary. Timeline data is sourced from Firestore mock data.
 * Gemini only summarises the structured data — it does not alter dates or facts.
 */
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getTimeline } = require('../engine/timelineEngine');
const { explain } = require('../services/geminiService');
const { buildTimelinePrompt } = require('../services/geminiPromptBuilder');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { SOURCE_BADGES, DEFAULTS } = require('../utils/constants');

router.post('/', [
  body('state').notEmpty().isString().trim().escape(),
  body('language').optional().isIn(['en', 'hi']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  try {
    const { state, language = DEFAULTS.LANGUAGE } = req.body;
    const timeline = await getTimeline(state);
    const eventsSummary = timeline.events
      .map(e => `${e.event}: ${e.date} — ${e.description}`)
      .join('\n');

    const prompt = buildTimelinePrompt(timeline.state, eventsSummary);
    const geminiSummary = await explain(prompt, 'summary', language);

    return sendSuccess(res, { timeline, geminiSummary }, SOURCE_BADGES.ECI_OFFICIAL);
  } catch (err) { next(err); }
});

module.exports = router;
