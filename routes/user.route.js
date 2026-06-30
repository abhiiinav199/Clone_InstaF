import express from "express"
import { otpSave, signUp } from "../controllers/auth.js"

const userRouter= express.Router()

userRouter.post("/otp-create", otpSave)
userRouter.post("/sign-up", signUp)

export default userRouter