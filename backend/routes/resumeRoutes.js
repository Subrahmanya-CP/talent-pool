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

/**
 * @route   GET /api/resumes/view/:id
 * @desc    Redirect to a presigned S3 URL for a candidate resume
 * @access  Public
 */
router.get('/view/:id', resumeController.viewResumeById);

export default router;
