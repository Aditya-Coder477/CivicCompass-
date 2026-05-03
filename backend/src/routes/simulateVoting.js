const router = require('express').Router();
const { getDoc } = require('../services/firestoreService');

router.post('/', async (req, res, next) => {
  try {
    const doc = await getDoc('votingSimulation', 'votingSteps');
    const steps = doc ? doc.steps : [];
    res.json({ steps, totalSteps: steps.length, sourceBadge: 'ECI Official Data' });
  } catch (err) { next(err); }
});

module.exports = router;
