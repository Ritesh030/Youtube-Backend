import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { CLOUDINARY_API_KEY } from "../constants.js"
import { CLOUDINARY_CLOUD_NAME } from "../constants.js"
import { CLOUDINARY_API_SECRET } from "../constants.js"
import { apiError } from './apiErrors.js'

cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(
      localFilePath,
      { resource_type: "auto" }
    );

    fs.unlinkSync(localFilePath);

    return {
      url: response.secure_url,
      publicId: response.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true }); // invalidate: true -- > Purge this asset from all CDN caches right now.
  } catch (err) {
    console.error("Cloudinary deletion failed:", err.message);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary }