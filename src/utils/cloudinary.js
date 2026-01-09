import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();

// console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadoncloudinary =  async(localfilepath) => {
    try {
        if(!localfilepath) return null;
        //upload file on cloudinary
        const response =  await cloudinary.uploader.upload(localfilepath,{
            resource_type : "auto"
        })
        //file uploaded successfully
        // console.log("File is uploaded on cloudinary",response.url);
        fs.unlinkSync(localfilepath);
        return response;
    } catch (error) {
        console.error("CLOUDINARY ERROR:", error); // Add this to see the actual error
        fs.unlinkSync(localfilepath) 
        return null;
    }
}

export default uploadoncloudinary