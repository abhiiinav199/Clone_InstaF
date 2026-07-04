import express from "express"
import { login, otpSave, resetPasswordOtpSend, resetPasswordOtpVerify, signUp } from "../controllers/auth.js"

const userRouter= express.Router()

userRouter.post("/otp-create", otpSave)
userRouter.post("/sign-up", signUp)
userRouter.post("/log-in", login)
userRouter.post("/reset-password", resetPasswordOtpSend)
userRouter.post("/reset-password-otp-verify", resetPasswordOtpVerify)

export default userRouter