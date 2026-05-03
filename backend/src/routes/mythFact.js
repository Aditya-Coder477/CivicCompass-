const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getCollection } = require('../services/firestoreService');
const { explain } = require('../services/geminiService');

router.post('/', [
  body('language').optional().isIn(['en', 'hi']),
  body('category').optional().isString().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { language = 'en', category } = req.body;
    const filters = category ? [['category', '==', category]] : [];
    let cards = await getCollection('mythFacts', filters);

    if (language === 'hi') {
      cards = await Promise.all(cards.map(async card => {
        const translatedMyth = await explain(`Myth: ${card.myth}`, 'official', 'hi');
        const translatedFact = await explain(`Fact: ${card.fact}`, 'official', 'hi');
        return { ...card, myth: translatedMyth, fact: translatedFact };
      }));
    }

    res.json({ cards, sourceBadge: 'ECI Verified Data' });
  } catch (err) { next(err); }
});

module.exports = router;
