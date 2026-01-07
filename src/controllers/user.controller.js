import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";

const registeruser = asyncHandler(async(req,res)=>{
    //get user data from frontend
    //validation - not empty
    //check user already exist : username or email
    //check for images  : main(avatar)
    //upload cloudinary , check avatar
    // create user object - create entry in db
    //remove password and refresh token from response
    //check user is created or not
    //return res

    const {fullname , username , email , password} = req.body
    console.log("email: " , email);

    if (!username || !fullname || !email || !password) {
        throw new apiError(400, "All fields are required")
    }

    //if already exist
    const existed = await User.findOne({
        $or: [{username},{email}]
    })
    if(existed){
        throw new apiError(409,"User already exist ")
    }

    //check image
    const avatarlocalpath  = req.files?.avatar[0]?.path;
    const coverimagelocalpath = req.files?.coverimage[0]?.path;

    if(!avatarlocalpath){
        throw new apiError(400,"avatar file is required");
    }

    const avatar = await uploadoncloudinary(avatarlocalpath);
    const coverimage  = await uploadoncloudinary(coverimagelocalpath);

    if(!avatar){
        throw new apiError(400,"avatar file is required");
    }

    //create user obj
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverimage : coverimage?.url || " ",
        email,
        password,
        username : username.toLowerCase()
    })
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new apiError("500","Internal Server error");
    }

    return res.status(201).json(
        new apiResponse(200,createduser,"User registered successfully")
    )


})

export default registeruser