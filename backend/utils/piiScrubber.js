/**
 * Scrubs personally identifiable information from text
 * Replaces emails, phones, LinkedIn URLs, and GitHub URLs with placeholders
 * @param {string} text - Original text with PII
 * @returns {string} Text with PII scrubbed
 */
export const scrubPII = (text) => {
  let scrubbedText = text;

  // Scrub emails
  scrubbedText = scrubbedText.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');

  // Scrub phone numbers
  scrubbedText = scrubbedText.replace(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g, '[PHONE]');

  // Scrub LinkedIn URLs
  scrubbedText = scrubbedText.replace(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/[a-zA-Z0-9-]+/gi, '[LINKEDIN]');

  // Scrub GitHub URLs
  scrubbedText = scrubbedText.replace(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/gi, '[GITHUB]');

  return scrubbedText;
};

export default { scrubPII };
