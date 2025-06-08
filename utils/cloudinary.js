'use strict';

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

const upload = multer({ storage });

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