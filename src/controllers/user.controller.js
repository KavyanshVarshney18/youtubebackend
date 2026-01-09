import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";

const generateaccessandrefreshtoken = async(userid)=>{
    try {
        const user = await User.findOne(userid);
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()

        user.refreshtoken = refreshtoken;
       await user.save({validateBeforeSave : false});

       return {refreshtoken,accesstoken}

    } catch (err) {
        throw new apiError(500,"Something went wrong while generating access and refresh token")
    }
}


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
    // console.log("email: " , email);

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
    // console.log("FILES =>", req.files);

    const avatarlocalpath  = req.files?.avatar?.[0]?.path;
    const coverimagelocalpath = req.files?.coverimage?.[0]?.path;

    // 1. Check local path
if (!avatarlocalpath) {
    throw new apiError(400, "Avatar file is required (Local path not found)");
}

// 2. Upload
const avatar = await uploadoncloudinary(avatarlocalpath);
const coverimage = await uploadoncloudinary(coverimagelocalpath);

// 3. Check Cloudinary Result
if (!avatar) {
    throw new apiError(400, "Avatar failed to upload to Cloudinary");
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



export const loginuser = asyncHandler(async(req,res)=>{
    //req body - data
    //username or email
    //find user
    //password check
    //access and refresh token
    //send cookies

    const {username,email,password} = req.body;
    if(!username || !email){
        throw new apiError(400,"username or email is required ")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apiError(404,"User not found")
    }

    const ispasswordvalid = await user.isPasswordCorrect(password);

    if(!ispasswordvalid){
        throw new apiError(401,"password incorrect")
    }

    const {accesstoken,refreshtoken} = await generateaccessandrefreshtoken(user._id);

    const loggedinuser = await User.findById(user._id).select("-password -refreshToken")

    const options={                            //cookies can be updated by server only
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .cookie("accessToken",accesstoken,options)
    .cookie("refreshToken",refreshtoken,options)
    .json(
        new apiResponse(
            200,
            {
                user : loggedinuser,accesstoken,refreshtoken
            },
            "User Logged in Successfullt"
        )
    )

})


export const logoutuser = asyncHandler(async(req,res)=>{
    
})
export default registeruser