/**
 * Extracts contact information from resume text using regex patterns
 * @param {string} text - Resume text
 * @returns {Object} Extracted contact information
 */
export const extractContactInfo = (text) => {
  const contactInfo = {
    name: null,
    email: null,
    phone: null,
    linkedin: null,
    github: null,
  };

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch && emailMatch.length > 0) {
    contactInfo.email = emailMatch[0];
  }

  // Extract phone numbers (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch && phoneMatch.length > 0) {
    contactInfo.phone = phoneMatch[0];
  }

  // Extract LinkedIn URL
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/[a-zA-Z0-9-]+/gi;
  const linkedinMatch = text.match(linkedinRegex);
  if (linkedinMatch && linkedinMatch.length > 0) {
    contactInfo.linkedin = linkedinMatch[0].replace(/^https?:\/\//, '').replace(/^www\./, '');
  }

  // Extract GitHub URL
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/gi;
  const githubMatch = text.match(githubRegex);
  if (githubMatch && githubMatch.length > 0) {
    contactInfo.github = githubMatch[0].replace(/^https?:\/\//, '').replace(/^www\./, '');
  }

  // Extract name (heuristic: look for common name patterns in the first few lines)
  // This is a simple heuristic - in production, you might use NLP or a dedicated parser
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const isHeaderLine = (line) => /(?:resume|curriculum vitae|objective|summary|email|phone|linkedin|github|address)/i.test(line);
  const cleanNameLine = (line) => line.replace(/^[Nn]ame\s*[:\-]?\s*/i, '').replace(/[•·]/g, '').trim();
  const looksLikeName = (line) => {
    const cleaned = cleanNameLine(line);
    if (!cleaned || /\d/.test(cleaned)) return false;
    const words = cleaned.split(/\s+/);
    if (words.length < 2 || words.length > 4) return false;
    return words.every((word) => /^[A-Z][a-zA-Z'-]+$/.test(word));
  };

  for (const line of lines.slice(0, 8)) {
    if (/^[Nn]ame\s*[:\-]/.test(line)) {
      const candidateName = cleanNameLine(line);
      if (candidateName) {
        contactInfo.name = candidateName;
        break;
      }
    }

    if (isHeaderLine(line) || /@/.test(line) || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line)) {
      continue;
    }

    if (looksLikeName(line)) {
      contactInfo.name = cleanNameLine(line);
      break;
    }
  }

  if (!contactInfo.name && lines.length > 0) {
    const fallbackLine = lines[0].replace(/[•·]/g, '').trim();
    if (!/@/.test(fallbackLine) && !/\d/.test(fallbackLine) && fallbackLine.split(/\s+/).length <= 4) {
      contactInfo.name = fallbackLine;
    }
  }

  return contactInfo;
};

export default { extractContactInfo };
