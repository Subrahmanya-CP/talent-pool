import { useState } from 'react';
import { candidateService } from '../services/candidateService';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedCandidates, setUploadedCandidates] = useState([]);

  const uploadFiles = async (files) => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('resumes', file);
      });

      // Simulate progress (in production, use actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await candidateService.uploadResumes(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedCandidates(response.data.candidates);

      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setUploadProgress(0);
    setError(null);
    setUploadedCandidates([]);
  };

  return { uploadFiles, uploading, uploadProgress, error, uploadedCandidates, reset };
};

export default useFileUpload;
