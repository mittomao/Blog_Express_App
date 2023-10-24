'use strict';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
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
    // upload: async (image) => {
    //     const otp = {
    //         folder: "Blog",
    //     };

    //     await cloudinary.uploader
    //         .upload(image, otp)
    //         .then(result => console.log("Uploaded", result))
    //         .catch(error => console.log(error));
    // }
}