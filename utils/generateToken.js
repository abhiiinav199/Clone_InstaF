import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({})

export const generateToken= async ({userId,userName, email})=>{
    const token = await jwt.sign({ userId, userName, email }, process.env.JWT_SECRET, {expiresIn:"7D"})
    return token
}