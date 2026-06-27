import groq from '../config/groq.js';

/**
 * Score a candidate based on their overall quality
 * @param {Object} candidate - Candidate data
 * @returns {Promise<number>} - Score (0-100)
 */
export const scoreCandidate = async (candidate) => {
  const prompt = `
You are an expert recruiter. Score the following candidate on a scale of 0-100 based on their overall quality and potential.

Candidate Data:
- Name: ${candidate.name}
- Skills: ${candidate.skills.join(', ')}
- Experience: ${candidate.experience_years} years
- Latest Job Title: ${candidate.latest_job_title}
- Location: ${candidate.location}

Scoring Criteria:
- Skill diversity and relevance (40%)
- Experience level and progression (30%)
- Job title seniority (20%)
- Overall resume quality (10%)

Return ONLY a JSON object with the following structure:
{
  "score": 85,
  "reasoning": "Brief explanation of the score"
}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter who evaluates candidate quality.',
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
    const result = JSON.parse(responseContent);
    return result.score || 50;
  } catch (error) {
    console.error('Scoring error:', error);
    // Fallback scoring based on experience and skills
    const experienceScore = Math.min(candidate.experience_years * 5, 50);
    const skillScore = Math.min(candidate.skills.length * 5, 50);
    return experienceScore + skillScore;
  }
};

export default scoreCandidate;
