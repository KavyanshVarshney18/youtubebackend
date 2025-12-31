import cors from 'cors'
import cookieParser from 'cookie-parser';
import express from 'express'
const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded());
app.use(express.static("public"))
app.use(cookieParser());

// routes import
import userRouter from './routes/user.routes.js';

//routed declaration
app.use("/api/v1/users" , userRouter);




export default app;