import {v2 as cloudinary} from 'cloudinary';
import { config } from 'dotenv';
config()

cloudinary.config({
    cloud_name: process.env['CLOUD_NAME'],
    api_key: process.env['API_KEY_CLOUD'],
    api_secret: process.env['API_SECRET_CLOUD']
});

export const cloudinaryUploadImg = async (fileToUpload) => {
    return new Promise ((resolve) => {
        cloudinary.uploader.upload(fileToUpload,(err, callResult) => {
            console.log(callResult);
            resolve(
                {
                    url: callResult.secure_url
                },
                {
                    resource_type: "auto"
                }
            );
        });
    });
}
