'use strict';

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    timeout: 120000
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 2000, height: 2000, crop: 'limit' }
    ],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});


var self = module.exports = {
    getAllResources: async () => {
        let allImage = [];
        await cloudinary.api.resources(
            {
                type: 'upload',
                prefix: process.env.CLOUDINARY_API_FOLDER
            },
            function (error, result) {
                if (result) {
                    allImage = result.resources;
                } else {
                    allImage = [];
                }   
            });
        return allImage;
    },
    upload
}