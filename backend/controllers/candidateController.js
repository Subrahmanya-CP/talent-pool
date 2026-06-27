import { candidateQueries } from '../database/candidateQueries.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const safeCandidatesResponse = (candidates = []) => ({
  success: true,
  data: {
    candidates,
    count: candidates.length,
  },
});

export const candidateController = {
  /**
   * Get all candidates with optional filters
   * GET /api/candidates?skill=javascript&minExperience=2&location=new+york
   */
  getCandidates: asyncHandler(async (req, res) => {
    const { skill, minExperience, location } = req.query;

    const filters = {};
    if (skill) filters.skill = skill;
    if (minExperience) filters.minExperience = parseInt(minExperience);
    if (location) filters.location = location;

    try {
      const candidates = await candidateQueries.getCandidates(filters);
      return res.status(200).json(safeCandidatesResponse(candidates));
    } catch (error) {
      console.error('Failed to load candidates:', error.message);
      return res.status(200).json(safeCandidatesResponse([]));
    }
  }),

  /**
   * Get a single candidate by ID
   * GET /api/candidates/:id
   */
  getCandidateById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const candidate = await candidateQueries.getCandidateById(id);
      return res.status(200).json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      console.error('Failed to load candidate by id:', error.message);
      return res.status(404).json({
        success: false,
        error: { message: 'Candidate not found' },
      });
    }
  }),

  /**
   * Delete a candidate by ID
   * DELETE /api/candidates/:id
   */
  deleteCandidate: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      await candidateQueries.deleteCandidate(id);
      return res.status(200).json({
        success: true,
        message: 'Candidate deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete candidate:', error.message);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to delete candidate' },
      });
    }
  }),
};

export default candidateController;
