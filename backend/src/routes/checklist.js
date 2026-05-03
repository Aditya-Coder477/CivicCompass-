const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getChecklist } = require('../engine/checklistEngine');
const { explain } = require('../services/geminiService');

router.post('/', [
  body('userType').optional().isIn(['first_time', 'registered', 'polling_day']),
  body('registered').optional().isBoolean(),
  body('language').optional().isIn(['en', 'hi']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { userType, registered = false, language = 'en' } = req.body;
    const checklist = await getChecklist({ userType, registered });

    let items = checklist.items;
    if (language === 'hi') {
      items = await Promise.all(items.map(async item => {
        const translated = await explain(item.task, 'official', 'hi');
        return { ...item, task: translated };
      }));
    }

    res.json({ type: checklist.type, title: checklist.title, items, sourceBadge: 'ECI Guidelines' });
  } catch (err) { next(err); }
});

module.exports = router;
