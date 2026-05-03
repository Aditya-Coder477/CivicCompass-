/**
 * Route: POST /api/booth-locator
 *
 * Finds the assigned polling booth for a voter based on their district,
 * state, or pincode. If the booth record has no coordinates, the backend
 * resolves them via the Google Maps Geocoding API.
 */
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { findBooth } = require('../engine/boothEngine');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { SOURCE_BADGES } = require('../utils/constants');

router.post('/', [
  body('district').optional().isString().trim().escape(),
  body('pincode').optional().isString().trim().escape(),
  body('state').optional().isString().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  try {
    const { district = '', pincode = '', state = '' } = req.body;
    const booth = await findBooth(district, pincode, state);
    if (!booth) return sendError(res, 'No booth found for the given location.', 404, SOURCE_BADGES.ECI_VERIFIED);
    return sendSuccess(res, { booth }, SOURCE_BADGES.ECI_VERIFIED);
  } catch (err) { next(err); }
});

module.exports = router;
