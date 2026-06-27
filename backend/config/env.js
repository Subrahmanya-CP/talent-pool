import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const splitList = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const getEnv = (name, defaultValue) => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value;
};

export const requireEnv = (name) => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getEnvInt = (name, defaultValue) => {
  const value = getEnv(name, defaultValue);
  return toNumber(value, defaultValue);
};

export const getEnvList = (name, fallback = []) => {
  return splitList(getEnv(name, '')) || fallback;
};

export const isProduction = process.env.NODE_ENV === 'production';
