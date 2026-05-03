/**
 * Route: POST /api/simulate-voting
 *
 * Returns the step-by-step voting simulation data from Firestore mock data.
 * This is a read-only, stateless operation — no user input is required.
 */
const router = require('express').Router();
const { getDoc } = require('../services/firestoreService');
const { sendSuccess } = require('../utils/responseHandler');
const { SOURCE_BADGES } = require('../utils/constants');

router.post('/', async (req, res, next) => {
  try {
    const doc = await getDoc('votingSimulation', 'votingSteps');
    const steps = doc ? doc.steps : [];
    return sendSuccess(res, { steps, totalSteps: steps.length }, SOURCE_BADGES.ECI_OFFICIAL);
  } catch (err) { next(err); }
});

module.exports = router;
