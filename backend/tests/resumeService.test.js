import test from 'node:test';
import assert from 'node:assert/strict';
import resumeService from '../services/resumeService.js';

test('validateUpload throws when no files are provided', () => {
  assert.throws(() => resumeService.validateUpload([]), { message: 'No files uploaded' });
});

test('validateUpload throws when invalid file types are provided', () => {
  const files = [{ mimetype: 'text/plain' }];
  assert.throws(
    () => resumeService.validateUpload(files),
    /Some files have invalid file types\. Only PDF and DOCX are allowed\./
  );
});

test('extractFileMetadata returns correct metadata', () => {
  const file = {
    originalname: 'resume.docx',
    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 12345,
    buffer: Buffer.from('test'),
  };

  const metadata = resumeService.extractFileMetadata(file);
  assert.equal(metadata.originalName, 'resume.docx');
  assert.equal(metadata.mimeType, file.mimetype);
  assert.equal(metadata.size, file.size);
  assert.equal(metadata.buffer, file.buffer);
  assert.equal(metadata.extension, 'docx');
});
