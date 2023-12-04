import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });
// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'ppsshop', 
  api_key: '914379515476283', 
  api_secret: 'tb8sr4wSHWx09EhwRIzUT1om9eE' 
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log(localFilePath,"local");
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        return response;

    } 
    catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.log(localFilePath,"local");
        return null;
    }
}



export {uploadOnCloudinary}