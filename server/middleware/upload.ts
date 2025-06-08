import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../lib/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Unsupported file type');
    }

    return {
      folder: 'wrapy-media',
      resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      format: undefined, // Let Cloudinary auto-determine the format
    };
  },
});

export const upload = multer({ storage });
