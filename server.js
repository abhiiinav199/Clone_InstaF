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
import postRouter from './routes/post.route.js'
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.route.js'
import messageRouter from './routes/message.route.js'
const PORT = process.env.PORT || 8080
import { app, httpServer } from './socket/socket.js' //express server connected with socket.io(dont comment out or delete this import)
// const app = express()  //not in use



app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

app.get("/", async (_, res) => {
    try {
       
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
app.use("/api/v1", postRouter)
app.use("/api/v1", likeRouter)
app.use("/api/v1", commentRouter)
app.use("/api/v1", messageRouter)

const startServer = async () => {
    try {
        await connectDB()
        httpServer.listen(PORT, () => {
            console.log(`Port is running on localhost:${PORT}`)
        })

    } catch (error) {
        console.log("Failed to Connect to Db", error)
    }

}

startServer()