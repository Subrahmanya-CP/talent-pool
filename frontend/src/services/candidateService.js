import api from './api';

export const candidateService = {
  /**
   * Upload resume files
   * @param {FormData} formData - FormData with resume files
   * @returns {Promise<Object>} Upload response
   */
  async uploadResumes(formData) {
    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all candidates with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Candidates response
   */
  async getCandidates(filters = {}) {
    const params = new URLSearchParams();
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.minExperience) params.append('minExperience', filters.minExperience);
    if (filters.location) params.append('location', filters.location);

    const response = await api.get(`/candidates?${params.toString()}`);
    return response.data;
  },

  /**
   * Get candidate by ID
   * @param {string} id - Candidate ID
   * @returns {Promise<Object>} Candidate response
   */
  async getCandidateById(id) {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  /**
   * Delete candidate by ID
   * @param {string} id - Candidate ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteCandidate(id) {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};

export default candidateService;
