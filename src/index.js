import connectDb from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });


connectDb();
















/* require('dotenv').config()
const express = require('express');
const app = express();


(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)
        app.on("error" , (err) => {
            console.log("express problem",err)
            throw err
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Application listening on port ${process.env.PORT}`)
        })

    }catch (err) {
        console.log(err);
        throw err 
    }
}) ()

*/

