import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pfps',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

export const upload = multer({
  storage,
  limits: { files: 1, fileSize: 5 * 1024 * 1024 },
});
