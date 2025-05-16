import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../utils/s3';
import dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    // acl: 'public-read',
    metadata: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: any, metadata?: any) => void
    ) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});
