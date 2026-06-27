import express from 'express';
import { candidateController } from '../controllers/candidateController.js';

const router = express.Router();

/**
 * @route   GET /api/candidates
 * @desc    Get all candidates with optional filters
 * @access  Public
 */
router.get('/', candidateController.getCandidates);

/**
 * @route   GET /api/candidates/:id
 * @desc    Get a single candidate by ID
 * @access  Public
 */
router.get('/:id', candidateController.getCandidateById);

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete a candidate by ID
 * @access  Public
 */
router.delete('/:id', candidateController.deleteCandidate);

export default router;
