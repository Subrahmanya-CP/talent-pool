import { supabase } from '../config/index.js';
import groq from '../config/groq.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const matchJob = asyncHandler(async (req, res) => {
  console.log("✅ matchJob controller started");

  const { jobDescription } = req.body;
  if (!jobDescription) {
    return res.status(400).json({ error: { message: 'Job description is required' } });
  }

  // Get all candidates
  const { data: candidates, error } = await supabase
    .from('candidates')
    .select('*');

  if (error) {
    return res.status(500).json({ error: { message: 'Failed to fetch candidates' } });
  }

  // Use AI to match candidates to job
  const candidateSummaries = candidates.map(c => ({
    id: c.id,
    name: c.name,
    skills: c.skills,
    experience_years: c.experience_years,
    latest_job_title: c.latest_job_title,
    location: c.location,
  }));

  const prompt = `
You are an expert recruiter. Given a job description and a list of candidates, score each candidate's fit for the job on a scale of 0-100.

Job Description:
${jobDescription}

Candidates:
${JSON.stringify(candidateSummaries, null, 2)}

Return ONLY a JSON object with the following structure:
{
  "matches": [
    {
      "id": "candidate_id",
      "score": 85,
      "reasoning": "Brief explanation of why this candidate is a good fit"
    }
  ]
}

Score based on:
- Skill match (40%)
- Experience level (30%)
- Relevance of latest job title (20%)
- Location preference (10%)

Return the matches array sorted by score in descending order.
`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an expert recruiter who evaluates candidate fit for job positions.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const responseContent = completion.choices[0].message.content;
  const response = JSON.parse(responseContent);
  const matches = response.matches || [];

  // Merge scores with candidate data
  const matchedCandidates = candidates.map(candidate => {
    const match = matches.find(m => m.id === candidate.id);
    return {
      ...candidate,
      matchScore: match?.score || 0,
      matchReasoning: match?.reasoning || '',
    };
  });

  // Sort by match score
  matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    jobDescription,
    matches: matchedCandidates,
    totalCandidates: candidates.length,
  });
});
