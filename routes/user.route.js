import express from "express"
import { otpSave } from "../controllers/auth.js"

const userRouter= express.Router()

userRouter.post("/register", otpSave)

export default userRouter