import express from 'express';
import { matchJob } from '../controllers/jobMatchController.js';

const router = express.Router();

router.post('/match', matchJob);

export default router;
