// We'll get the images from user and store the images in cloud (cloudinary) and from cloud we'll get the image links which we'll show in the show page. 

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

// Image storing directory & Format settings
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderManiac_listingImages', // A folder will be created (named "wanderManiac_listingImages") in cloudinary account where all the uploaded images will be saved
      allowedFormats: ['jpg', 'jpeg', 'png'], // supports promises as well
    },
});



module.exports = { cloudinary, storage };