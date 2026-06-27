import groq from '../config/groq.js';

/**
 * Extracts candidate information from scrubbed resume text using Groq API
 * @param {string} scrubbedText - Resume text with PII scrubbed
 * @returns {Promise<Object>} Extracted candidate information
 */
export const extractCandidateInfo = async (scrubbedText) => {
  const prompt = `
You are a resume parser. Extract the following information from the resume text below and return ONLY a valid JSON object.

Fields to extract:
- skills: Array of technical skills (e.g., ["JavaScript", "React", "Node.js"])
- experience_years: Total years of experience as a number
- latest_job_title: Most recent job title
- location: City and state/country
- summary: A professional 2-3 sentence candidate summary (max 60 words) describing the candidate's experience, technical skills, and current role

Resume text:
${scrubbedText}

Return ONLY the JSON object, no additional text or explanation.
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a precise resume parser that returns only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    
    // Parse and validate JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate required fields
    const requiredFields = ['skills', 'experience_years', 'latest_job_title', 'location', 'summary'];
    for (const field of requiredFields) {
      if (!(field in parsedData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure skills is an array
    if (!Array.isArray(parsedData.skills)) {
      parsedData.skills = [];
    }

    // Ensure experience_years is a number
    if (typeof parsedData.experience_years !== 'number') {
      parsedData.experience_years = 0;
    }

    // Ensure summary is a string
    if (typeof parsedData.summary !== 'string') {
      parsedData.summary = '';
    }

    return parsedData;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(`Failed to extract candidate info: ${error.message}`);
  }
};

export default { extractCandidateInfo };
