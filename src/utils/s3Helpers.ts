import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './s3';

export const deleteFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  await s3.send(command);
};

export const extractS3Key = (url: string): string => {
  const parts = url.split('.amazonaws.com/');
  return parts.length > 1 ? parts[1] : '';
};
