/**
 * Route: POST /api/next-steps
 *
 * Returns the top 3 most relevant next actions for a voter based on their profile.
 * Decisions are entirely rule-based — Gemini is not involved in this route.
 */
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getNextSteps } = require('../engine/nextStepEngine');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { SOURCE_BADGES, DEFAULTS } = require('../utils/constants');

router.post('/', [
  body('age').isInt({ min: 0, max: 120 }).withMessage('age must be an integer between 0 and 120'),
  body('registered').optional().isBoolean(),
  body('verified').optional().isBoolean(),
  body('pollProximityDays').optional().isInt(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  try {
    const {
      age,
      registered = false,
      verified = false,
      pollProximityDays = DEFAULTS.POLL_PROXIMITY_DAYS,
    } = req.body;

    const steps = getNextSteps({ age, registered, verified, pollProximityDays });
    return sendSuccess(res, { steps }, SOURCE_BADGES.ECI_GUIDELINES);
  } catch (err) { next(err); }
});

module.exports = router;
