import mongoose from "mongoose";
import { DB_NAME} from "../constants.js";


const connectDb = async () => {
        try {
            const connection_instance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

            console.log(`Mongo_db connected !! ${connection_instance.connection.host}`);
            
        } catch (err) {
            console.log("error in mongoose" , err)
            throw err
        }
}

export default connectDb;