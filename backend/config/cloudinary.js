const cloudinary = require('cloudinary').v2
const connectCloudinary = async function() {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        });
        console.log("Cloudinary connected successfully.");
    } catch (error) {
        console.error("Failed to connect to Cloudinary:", error.message);
    }
}
module.exports = connectCloudinary