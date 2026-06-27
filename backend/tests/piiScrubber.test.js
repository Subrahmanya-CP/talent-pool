import test from 'node:test';
import assert from 'node:assert/strict';
import { scrubPII } from '../utils/piiScrubber.js';

test('scrubs email, phone, linkedin, and github from text', () => {
  const text = `Contact me at john.doe@example.com or (555) 123-4567. LinkedIn: https://linkedin.com/in/johndoe GitHub: https://github.com/johndoe`;
  const result = scrubPII(text);

  assert.ok(result.includes('[EMAIL]'));
  assert.ok(result.includes('[PHONE]'));
  assert.ok(result.includes('[LINKEDIN]'));
  assert.ok(result.includes('[GITHUB]'));
});
