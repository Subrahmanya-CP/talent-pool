import { S3Client } from '@aws-sdk/client-s3';
import { requireEnv, getEnv } from './env.js';

const region = getEnv('AWS_REGION', 'us-east-1');
const accessKeyId = requireEnv('AWS_ACCESS_KEY_ID');
const secretAccessKey = requireEnv('AWS_SECRET_ACCESS_KEY');

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default s3Client;
