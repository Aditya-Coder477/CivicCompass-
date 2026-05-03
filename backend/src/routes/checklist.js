/**
 * Route: POST /api/checklist
 *
 * Returns the voter preparation checklist for the given voter type.
 * If language is Hindi, each checklist item is translated via Gemini.
 * The checklist structure and items are determined by the rule engine — not Gemini.
 */
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getChecklist } = require('../engine/checklistEngine');
const { explain } = require('../services/geminiService');
const { buildChecklistItemPrompt } = require('../services/geminiPromptBuilder');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { SOURCE_BADGES, DEFAULTS } = require('../utils/constants');

router.post('/', [
  body('userType').optional().isIn(['first_time', 'registered', 'polling_day']),
  body('registered').optional().isBoolean(),
  body('language').optional().isIn(['en', 'hi']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  try {
    const { userType, registered = false, language = DEFAULTS.LANGUAGE } = req.body;
    const checklist = await getChecklist({ userType, registered });

    // Translate items via Gemini only when Hindi is requested
    let items = checklist.items;
    if (language === 'hi') {
      items = await Promise.all(items.map(async item => {
        const translated = await explain(buildChecklistItemPrompt(item.task), 'official', 'hi');
        return { ...item, task: translated };
      }));
    }

    return sendSuccess(res, { type: checklist.type, title: checklist.title, items }, SOURCE_BADGES.ECI_GUIDELINES);
  } catch (err) { next(err); }
});

module.exports = router;
