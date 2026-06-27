import test from 'node:test';
import assert from 'node:assert/strict';
import { candidateMatchesFilters } from '../utils/candidateFilters.js';

test('matches skill filters case-insensitively and by partial text', () => {
  const candidate = {
    skills: ['JavaScript', 'React', 'Node.js'],
    experience_years: 5,
    location: 'New York',
  };

  assert.equal(candidateMatchesFilters(candidate, { skill: 'react' }), true);
  assert.equal(candidateMatchesFilters(candidate, { skill: 'node' }), true);
  assert.equal(candidateMatchesFilters(candidate, { skill: 'java' }), true);
  assert.equal(candidateMatchesFilters(candidate, { skill: 'python' }), false);
});

test('supports combined filters', () => {
  const candidate = {
    skills: ['React', 'TypeScript'],
    experience_years: 6,
    location: 'Austin, TX',
  };

  assert.equal(candidateMatchesFilters(candidate, { skill: 'react', minExperience: 5 }), true);
  assert.equal(candidateMatchesFilters(candidate, { skill: 'react', minExperience: 7 }), false);
  assert.equal(candidateMatchesFilters(candidate, { skill: 'react', location: 'austin' }), true);
});
