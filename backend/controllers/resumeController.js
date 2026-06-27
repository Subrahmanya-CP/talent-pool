import { resumeService } from '../services/resumeService.js';
import { extractTextFromPDF } from '../utils/pdfExtractor.js';
import { extractTextFromDOCX } from '../utils/docxExtractor.js';
import { extractContactInfo } from '../utils/contactExtractor.js';
import { scrubPII } from '../utils/piiScrubber.js';
import { extractCandidateInfo } from '../services/aiService.js';
import { uploadToS3 } from '../services/s3Service.js';
import { candidateQueries } from '../database/candidateQueries.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const resumeController = {
  /**
   * Handle resume upload endpoint
   * POST /api/resumes/upload
   */
  uploadResumes: asyncHandler(async (req, res) => {
    const files = req.files;

    // Validate upload using service layer
    const { files: validFiles } = resumeService.validateUpload(files);

    const processedCandidates = [];

    // Process each file
    for (const file of validFiles) {
      const metadata = resumeService.extractFileMetadata(file);

      // Step 1: Extract text based on file type
      let text;
      if (metadata.extension === 'pdf') {
        text = await extractTextFromPDF(metadata.buffer);
      } else if (metadata.extension === 'docx') {
        text = await extractTextFromDOCX(metadata.buffer);
      } else {
        throw new Error(`Unsupported file type: ${metadata.extension}`);
      }

      // Step 2: Extract contact information using regex
      const contactInfo = extractContactInfo(text);

      // Step 3: Scrub PII from text
      const scrubbedText = scrubPII(text);

      // Step 4: Extract candidate info using AI
      const aiInfo = await extractCandidateInfo(scrubbedText);

      // Step 5: Upload resume to S3
      const s3Url = await uploadToS3(metadata.buffer, metadata.originalName, metadata.mimeType);

      // Step 6: Store candidate in database
      const candidateData = {
        name: contactInfo.name || 'Unknown',
        email: contactInfo.email || null,
        phone: contactInfo.phone || null,
        linkedin: contactInfo.linkedin || null,
        github: contactInfo.github || null,
        skills: aiInfo.skills,
        experience_years: aiInfo.experience_years,
        latest_job_title: aiInfo.latest_job_title,
        location: aiInfo.location,
        summary: aiInfo.summary,
        resume_s3_url: s3Url,
        scrubbed_resume_text: scrubbedText,
        created_at: new Date().toISOString(),
      };

      const savedCandidate = await candidateQueries.createCandidate(candidateData);
      processedCandidates.push(savedCandidate);
    }

    res.status(200).json({
      success: true,
      message: 'Resumes processed successfully',
      data: {
        candidates: processedCandidates,
        count: processedCandidates.length,
      },
    });
  }),
};

export default resumeController;
