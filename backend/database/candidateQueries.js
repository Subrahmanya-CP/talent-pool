import { supabase } from '../config/database.js';
import { candidateMatchesFilters } from '../utils/candidateFilters.js';

/**
 * Database operations for candidates
 */
export const candidateQueries = {
  /**
   * Insert a new candidate into the database
   * @param {Object} candidateData - Candidate information
   * @returns {Promise<Object>} Inserted candidate record
   */
  async createCandidate(candidateData) {
    const safeCandidateData = { ...candidateData };
    if (safeCandidateData.summary === undefined) {
      safeCandidateData.summary = null;
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert([safeCandidateData])
      .select()
      .single();

    if (error) {
      if (error.message?.includes('summary')) {
        const fallbackData = { ...safeCandidateData };
        delete fallbackData.summary;

        const { data: fallbackDataResult, error: fallbackError } = await supabase
          .from('candidates')
          .insert([fallbackData])
          .select()
          .single();

        if (fallbackError) {
          throw new Error(`Database error: ${fallbackError.message}`);
        }

        return fallbackDataResult;
      }

      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Get all candidates with optional filters
   * @param {Object} filters - Filter options (skill, experience, location)
   * @returns {Promise<Array>} Array of candidates
   */
  async getCandidates(filters = {}) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return (data || []).filter((candidate) => candidateMatchesFilters(candidate, filters));
  },

  /**
   * Get a single candidate by ID
   * @param {string} id - Candidate ID
   * @returns {Promise<Object>} Candidate record
   */
  async getCandidateById(id) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Candidate not found');
      }
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Delete a candidate by ID
   * @param {string} id - Candidate ID
   * @returns {Promise<void>}
   */
  async deleteCandidate(id) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
};

export default candidateQueries;
