import express from 'express';
import { scoreAllCandidates, scoreCandidateById } from '../controllers/scoringController.js';

const router = express.Router();

router.post('/all', scoreAllCandidates);
router.post('/:id', scoreCandidateById);

export default router;
