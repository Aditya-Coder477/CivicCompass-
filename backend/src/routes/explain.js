const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { explain } = require('../services/geminiService');

router.post('/', [
  body('content').notEmpty().isString().isLength({ max: 2000 }),
  body('style').optional().isIn(['eli5', 'summary', 'official', 'today']),
  body('language').optional().isIn(['en', 'hi']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { content, style = 'summary', language = 'en' } = req.body;
    const explanation = await explain(content, style, language);
    res.json({ explanation, style, language, sourceBadge: 'Simplified' });
  } catch (err) { next(err); }
});

module.exports = router;
