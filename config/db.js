import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
if(!process.env.MONGO_URI) throw new Error("Please Provide Mongo_URI in the .env file")


export const connectDB = async() =>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URI)
        console.log("Db Connected")
    } catch (error) {
        console.log("MongoDb connection error")
        process.exit(1)
    }
}

