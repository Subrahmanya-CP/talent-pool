import Groq from 'groq-sdk';
import { requireEnv } from './env.js';

const groq = new Groq({
  apiKey: requireEnv('GROQ_API_KEY'),
});

export default groq;
