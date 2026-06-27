import { supabase } from '../config/index.js';
import { scoreCandidate } from '../services/scoringService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const scoreAllCandidates = asyncHandler(async (req, res) => {
  // Get all candidates
  const { data: candidates, error } = await supabase
    .from('candidates')
    .select('*');

  if (error) {
    return res.status(500).json({ error: { message: 'Failed to fetch candidates' } });
  }

  // Score each candidate
  const scoredCandidates = await Promise.all(
    candidates.map(async (candidate) => {
      const score = await scoreCandidate(candidate);
      
      // Update candidate with score
      await supabase
        .from('candidates')
        .update({ score })
        .eq('id', candidate.id);

      return {
        ...candidate,
        score,
      };
    })
  );

  res.json({
    message: 'All candidates scored successfully',
    candidates: scoredCandidates,
  });
});

export const scoreCandidateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get candidate
  const { data: candidate, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !candidate) {
    return res.status(404).json({ error: { message: 'Candidate not found' } });
  }

  // Score candidate
  const score = await scoreCandidate(candidate);

  // Update candidate with score
  await supabase
    .from('candidates')
    .update({ score })
    .eq('id', id);

  res.json({
    message: 'Candidate scored successfully',
    candidate: {
      ...candidate,
      score,
    },
  });
});
