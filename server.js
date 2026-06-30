import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import userRouter from './routes/user.route.js'
dotenv.config({})

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

app.get("/", (_, res) => {
    res.json({ message: "hello world 3001" })
})

app.use("/api/v1/auth", userRouter)

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