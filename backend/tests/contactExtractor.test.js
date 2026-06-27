import test from 'node:test';
import assert from 'node:assert/strict';
import { extractContactInfo } from '../utils/contactExtractor.js';

test('extracts name, email, phone, linkedin and github from resume text', () => {
  const text = `John Doe\nEmail: john.doe@example.com\nPhone: (555) 123-4567\nLinkedIn: https://linkedin.com/in/johndoe\nGitHub: https://github.com/johndoe`;
  const result = extractContactInfo(text);

  assert.equal(result.name, 'John Doe');
  assert.equal(result.email, 'john.doe@example.com');
  assert.equal(result.phone, '(555) 123-4567');
  assert.equal(result.linkedin, 'linkedin.com/in/johndoe');
  assert.equal(result.github, 'github.com/johndoe');
});
