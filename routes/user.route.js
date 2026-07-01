import express from "express"
import { login, otpSave, signUp } from "../controllers/auth.js"

const userRouter= express.Router()

userRouter.post("/otp-create", otpSave)
userRouter.post("/sign-up", signUp)
userRouter.post("/log-in", login)

export default userRouter