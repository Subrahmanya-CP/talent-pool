import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../config/s3.js';
import { randomBytes } from 'crypto';

/**
 * Upload a file buffer to AWS S3
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} S3 file URL
 */
export const uploadToS3 = async (buffer, originalName, mimeType) => {
  const bucketName = process.env.AWS_S3_BUCKET;
  
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET environment variable is not set');
  }

  // Generate unique filename
  const fileExtension = originalName.split('.').pop();
  const fileName = `resumes/${Date.now()}-${randomBytes(8).toString('hex')}.${fileExtension}`;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'private', // Files are private, accessed via presigned URLs if needed
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    
    // Return the S3 object URL (note: this may not be publicly accessible)
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
};

export const getPresignedUrl = async (s3Url, expiresIn = 900) => {
  const bucketName = process.env.AWS_S3_BUCKET;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET environment variable is not set');
  }

  if (!s3Url) {
    throw new Error('S3 URL is required to generate presigned URL');
  }

  let objectKey;
  try {
    const parsedUrl = new URL(s3Url);
    objectKey = parsedUrl.pathname.replace(/^\//, '');
  } catch (error) {
    throw new Error('Invalid S3 URL provided');
  }

  if (!objectKey) {
    throw new Error('Unable to determine S3 object key');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('S3 Presign Error:', error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};

export default { uploadToS3, getPresignedUrl };
