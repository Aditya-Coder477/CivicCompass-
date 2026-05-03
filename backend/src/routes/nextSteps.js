const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getNextSteps } = require('../engine/nextStepEngine');

router.post('/', [
  body('age').isInt({ min: 0, max: 120 }),
  body('registered').optional().isBoolean(),
  body('verified').optional().isBoolean(),
  body('pollProximityDays').optional().isInt(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { age, registered = false, verified = false, pollProximityDays = 999 } = req.body;
    const steps = getNextSteps({ age, registered, verified, pollProximityDays });
    res.json({ steps, sourceBadge: 'ECI Guidelines' });
  } catch (err) { next(err); }
});

module.exports = router;
