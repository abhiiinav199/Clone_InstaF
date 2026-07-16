import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import userRouter from './routes/user.route.js'
import followUnfollowRouter from './routes/followUnfollow.route.js'
dotenv.config({})
import mongoose from "mongoose"
import postRouter from './routes/post.route.js'

const PORT = process.env.PORT || 8080
const app = express()


app.use(cors({
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// const tempSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     age: {
//         type: Number,
//         required: true,
//         min: 18
//     }
// });

// const tempModel = mongoose.model("Temp", tempSchema)


app.get("/", async (_, res) => {
    try {
        // const result = await tempModel.insertMany([
        //     {
        //         name: "A",
        //         email: "a@gmail.com",
        //         age: 25
        //     },

        //     {
        //         name: "B",
        //         email: "a@gmail.com", // duplicate
        //         age: 30
        //     },

        //     {
        //         name: "C",
        //         email: "c@gmail.com",
        //         age: 40
        //     }
        // ]);
        // res.status(200).json({
        //     message: "Users created successfully",
        //     success: true,
        //     error: false,
        //     data: result
        // })
        res.status(200).json("HellowWorld")
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
})

app.use("/api/v1/auth", userRouter)
app.use("/api/v1", followUnfollowRouter)
app.use("/api/v1/", postRouter)

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Port is running on localhost:${PORT}`)
        })

    } catch (error) {
        console.log("Failed to Connect to Db", error)
    }

}

startServer()