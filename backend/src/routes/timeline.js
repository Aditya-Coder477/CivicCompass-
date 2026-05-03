const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getTimeline } = require('../engine/timelineEngine');
const { explain } = require('../services/geminiService');

router.post('/', [
  body('state').notEmpty().isString().trim().escape(),
  body('language').optional().isIn(['en', 'hi']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { state, language = 'en' } = req.body;
    const timeline = await getTimeline(state);
    const summary = timeline.events.map(e => `${e.event}: ${e.date} — ${e.description}`).join('\n');
    const geminiSummary = await explain(`Election timeline for ${timeline.state}:\n${summary}`, 'summary', language);
    res.json({ timeline, geminiSummary, sourceBadge: 'ECI Official Data' });
  } catch (err) { next(err); }
});

module.exports = router;
