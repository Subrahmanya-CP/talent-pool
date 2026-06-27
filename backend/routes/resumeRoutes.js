import express from 'express';
import { resumeController } from '../controllers/resumeController.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/resumes/upload
 * @desc    Upload multiple resume files (PDF/DOCX)
 * @access  Public
 */
router.post('/upload', uploadMiddleware, resumeController.uploadResumes);

export default router;
