/**
 * Route: POST /api/myth-fact
 *
 * Returns election myth-vs-fact cards from Firestore mock data.
 * Optionally filtered by category. If language is Hindi, each card's
 * myth and fact text are translated via Gemini.
 */
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getCollection } = require('../services/firestoreService');
const { explain } = require('../services/geminiService');
const { buildMythFactPrompts } = require('../services/geminiPromptBuilder');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { SOURCE_BADGES, DEFAULTS } = require('../utils/constants');

router.post('/', [
  body('language').optional().isIn(['en', 'hi']),
  body('category').optional().isString().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  try {
    const { language = DEFAULTS.LANGUAGE, category } = req.body;
    const filters = category ? [['category', '==', category]] : [];
    let cards = await getCollection('mythFacts', filters);

    // Translate myth and fact text via Gemini only when Hindi is requested
    if (language === 'hi') {
      cards = await Promise.all(cards.map(async card => {
        const { mythPrompt, factPrompt } = buildMythFactPrompts(card.myth, card.fact);
        const [translatedMyth, translatedFact] = await Promise.all([
          explain(mythPrompt, 'official', 'hi'),
          explain(factPrompt, 'official', 'hi'),
        ]);
        return { ...card, myth: translatedMyth, fact: translatedFact };
      }));
    }

    return sendSuccess(res, { cards }, SOURCE_BADGES.ECI_VERIFIED);
  } catch (err) { next(err); }
});

module.exports = router;
