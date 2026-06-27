import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

export const resumeService = {
  /**
   * Validates and processes uploaded resume files
   * @param {Array} files - Array of uploaded files from multer
   * @returns {Object} Validation result with files or error
   */
  validateUpload(files) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    if (files.length > 10) {
      throw new Error('Maximum 10 files allowed per upload');
    }

    // Validate each file
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      return validTypes.includes(file.mimetype);
    });

    if (validFiles.length !== files.length) {
      throw new Error('Some files have invalid file types. Only PDF and DOCX are allowed.');
    }

    return { files: validFiles };
  },

  /**
   * Extracts file metadata for processing
   * @param {Object} file - Uploaded file object
   * @returns {Object} File metadata
   */
  extractFileMetadata(file) {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      buffer: file.buffer,
      extension: file.originalname.split('.').pop().toLowerCase(),
    };
  },
};

export default resumeService;
