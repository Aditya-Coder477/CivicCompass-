const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { evaluateEligibility } = require('../engine/eligibility');
const { calculateStage, getStageInfo } = require('../engine/journeyEngine');
const { getDoc } = require('../services/firestoreService');
const { explain } = require('../services/geminiService');

const validate = [
  body('age').isInt({ min: 0, max: 120 }).withMessage('age must be an integer 0–120'),
  body('state').optional().isString().trim().escape(),
  body('language').optional().isIn(['en', 'hi']),
  body('style').optional().isIn(['eli5', 'summary', 'official', 'today']),
];

router.post('/', validate, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { age, registered = false, verified = false, pollProximityDays = 999, language = 'en', style = 'summary' } = req.body;
    const profile = { age, registered, verified, pollProximityDays };

    const eligibility = evaluateEligibility(profile);
    const stageIndex = calculateStage(profile);
    const stageInfo = getStageInfo(stageIndex);
    const stageDoc = await getDoc('journeyStages', `stage_${stageIndex}`);

    const rawText = stageDoc
      ? `You are at stage "${stageDoc.label}". ${stageDoc.description} Tip: ${stageDoc.tips}`
      : `You are at ${stageInfo.label}.`;

    const geminiExplanation = await explain(rawText, style, language);

    res.json({
      eligibility,
      stage: stageInfo,
      stageDetails: stageDoc || {},
      geminiExplanation,
      sourceBadge: 'ECI Guidelines',
    });
  } catch (err) { next(err); }
});

module.exports = router;
