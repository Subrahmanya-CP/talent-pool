import multer from 'multer';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
  }
};

// Configure multer
import { getEnvInt } from '../config/env.js';

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: getEnvInt('MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB default
    files: 10, // Maximum 10 files at once
  },
});

export const uploadMiddleware = upload.array('resumes', 10);
