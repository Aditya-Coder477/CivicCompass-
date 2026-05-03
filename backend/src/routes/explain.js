/**
 * Route: POST /api/explain
 *
 * Accepts any text content and rephrases/translates it using Gemini.
 * This is the direct Gemini explanation endpoint — used by the chat assistant.
 * Gemini ONLY rephrases the provided content; it does not add information.
 */
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { explain } = require('../services/geminiService');
const { buildExplainPrompt } = require('../services/geminiPromptBuilder');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { DEFAULTS } = require('../utils/constants');

router.post('/', [
  body('content').notEmpty().isString().isLength({ max: 2000 }),
  body('style').optional().isIn(['eli5', 'summary', 'official', 'today']),
  body('language').optional().isIn(['en', 'hi']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  try {
    const { content, style = DEFAULTS.STYLE, language = DEFAULTS.LANGUAGE } = req.body;
    const explanation = await explain(buildExplainPrompt(content), style, language);
    return sendSuccess(res, { explanation, style, language }, 'Simplified');
  } catch (err) { next(err); }
});

module.exports = router;
