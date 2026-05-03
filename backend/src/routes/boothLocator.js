const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { findBooth } = require('../engine/boothEngine');

router.post('/', [
  body('district').optional().isString().trim().escape(),
  body('pincode').optional().isString().trim().escape(),
  body('state').optional().isString().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { district = '', pincode = '', state = '' } = req.body;
    const booth = await findBooth(district, pincode, state);
    if (!booth) return res.status(404).json({ error: 'No booth found for the given location.', sourceBadge: 'ECI Verified Data' });
    res.json({ booth, sourceBadge: 'ECI Verified Data' });
  } catch (err) { next(err); }
});

module.exports = router;
