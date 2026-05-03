/**
 * Route: POST /api/journey
 *
 * Returns the user's current election journey stage, eligibility status,
 * and a Gemini-simplified explanation. All stage/eligibility decisions are
 * made by the deterministic rule engine — Gemini only rephrases the output.
 */
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { evaluateEligibility } = require('../engine/eligibility');
const { calculateStage, getStageInfo } = require('../engine/journeyEngine');
const { getDoc } = require('../services/firestoreService');
const { explain } = require('../services/geminiService');
const { buildJourneyPrompt } = require('../services/geminiPromptBuilder');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { SOURCE_BADGES, DEFAULTS } = require('../utils/constants');

const validate = [
  body('age').isInt({ min: 0, max: 120 }).withMessage('age must be an integer 0–120'),
  body('state').optional().isString().trim().escape(),
  body('language').optional().isIn(['en', 'hi']),
  body('style').optional().isIn(['eli5', 'summary', 'official', 'today']),
];

router.post('/', validate, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  try {
    const {
      age,
      registered = false,
      verified = false,
      pollProximityDays = DEFAULTS.POLL_PROXIMITY_DAYS,
      language = DEFAULTS.LANGUAGE,
      style = DEFAULTS.STYLE,
    } = req.body;

    const profile = { age, registered, verified, pollProximityDays };

    // Rule engine decisions — Gemini does NOT influence these
    const eligibility = evaluateEligibility(profile);
    const stageIndex = calculateStage(profile);
    const stageInfo = getStageInfo(stageIndex);
    const stageDoc = await getDoc('journeyStages', `stage_${stageIndex}`);

    // Build prompt from structured data, then pass to Gemini for rephrasing only
    const rawText = stageDoc
      ? buildJourneyPrompt(stageDoc.label, stageDoc.description, stageDoc.tips)
      : stageInfo.label;

    const geminiExplanation = await explain(rawText, style, language);

    return sendSuccess(res, { eligibility, stage: stageInfo, stageDetails: stageDoc || {}, geminiExplanation }, SOURCE_BADGES.ECI_GUIDELINES);
  } catch (err) { next(err); }
});

module.exports = router;
