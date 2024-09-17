import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { ApiError } from './ApiError.js';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath)
            return null

        //upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log((await response).metadata);
        //file has been uploaded successfully.
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)   //remove locally saved file.
        return null
    }
}

const deleteVideoFromCloudinary = async (fileLink) => {
    try {

        const publicId = extractPublicId(fileLink)
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        return true

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while deleting video")
    }
}

const deleteImageFromCloudinary = async (fileLink) => {
    try {

        const publicId = extractPublicId(fileLink)
        const result = await cloudinary.uploader.destroy(publicId);
        return true

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while deleting image")
    }
}

const extractPublicId = (fileLink) => {
    try {
        // Split fileLink to extract file name
        const parts = fileLink.split('/');
        const fileName = parts.pop();

        // Extract publicId by removing file extension
        const publicId = fileName.split('.').slice(0, -1).join('.');

        return publicId;
    } catch (error) {
        // Handle any errors during extraction
        console.error('Error extracting public ID:', error);
        return null;
    }
};


export { uploadOnCloudinary, deleteVideoFromCloudinary, deleteImageFromCloudinary }