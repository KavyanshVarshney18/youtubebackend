import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userschema = new mongoose.Schema(
    {
        username :{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true           // for searching
        },
        email :{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullname :{
            type : String,
            required : true,
            unique : true,
            trim : true,
            index : true
        },
        avatar : {
            type : String, //cloudinary url
            required : true
        },
        cover_image : {
            type : String   //cloudinary url
        },
        watchHistory : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        },
        password : {
            type : String,
            required : [true,"password is required"]
        },
        refreshToken : {
            type : String
        }

    }
,{timestamps:true});



userschema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10 )  //10 means 10 time hashing salt
    next();
})

userschema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password , this.password)
}


userschema.methods.generateAccessToken =  function (){
    return jwt.sign(
        {
            //payload
            _id  : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userschema.methods.generateRefreshToken = async function (){
    return jwt.sign(
        {
            //payload
            _id  : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userschema);