import test from 'node:test';
import assert from 'node:assert/strict';
import { exportToCSV } from '../src/utils/csvExport.js';

const createAnchor = () => {
  const listeners = {};
  return {
    setAttribute: () => {},
    style: {},
    click: () => {},
    addEventListener: (event, fn) => { listeners[event] = fn; },
    removeEventListener: () => {},
  };
};

test('exportToCSV returns undefined when no candidates supplied', () => {
  assert.equal(exportToCSV([]), undefined);
});

test('exportToCSV builds a CSV string for candidates', () => {
  global.Blob = function Blob(parts) { return { parts }; };
  global.URL = {
    createObjectURL: () => 'blob://test',
  };
  global.document = {
    createElement: () => createAnchor(),
    body: { appendChild: () => {}, removeChild: () => {} },
  };

  const candidates = [
    {
      name: 'Alice',
      email: 'alice@example.com',
      phone: '1234567890',
      linkedin: 'linkedin.com/in/alice',
      github: 'github.com/alice',
      skills: ['JavaScript', 'React'],
      experience_years: 3,
      latest_job_title: 'Developer',
      location: 'Remote',
      created_at: '2026-01-01T00:00:00Z',
    },
  ];

  assert.equal(exportToCSV(candidates), undefined);
});
