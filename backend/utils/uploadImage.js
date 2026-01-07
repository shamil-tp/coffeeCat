const cloudinary = require('cloudinary').v2

const uploadImageToCloudinary = async (file,width=null,height=null,folder,publicId) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, 
            {   
                public_id:publicId,
                folder: folder,
                width:width,
                height:height,
                crop:"fill",
                gravity:"face",
                overwrite:true,
            });
    
        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
    }
};
module.exports = uploadImageToCloudinary