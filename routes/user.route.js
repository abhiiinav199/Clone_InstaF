import express from "express"
import { login, otpSave, resetPassword, resetPasswordOtpSend, resetPasswordOtpVerify, signUp } from "../controllers/auth.controller.js"

const userRouter= express.Router()

userRouter.post("/otp-create", otpSave)
userRouter.post("/sign-up", signUp)
userRouter.post("/log-in", login)
userRouter.post("/reset-password", resetPasswordOtpSend)
userRouter.post("/reset-password-otp-verify", resetPasswordOtpVerify)
userRouter.put("/reset-password", resetPassword)
export default userRouter