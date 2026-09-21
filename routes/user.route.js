import express from "express"
import { login, otpSave, resetPassword, resetPasswordOtpSend, resetPasswordOtpVerify, signUp, suggestUser } from "../controllers/auth.controller.js"
import { loginValidation } from "../middlewares/Authorization.js"
import { editProfileDetails, profileDetails, uploadProfilePicture } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.js"

const userRouter= express.Router()

userRouter.post("/otp-create", otpSave)
userRouter.post("/sign-up", signUp)
userRouter.post("/log-in", login)
userRouter.post("/reset-password", resetPasswordOtpSend)
userRouter.post("/reset-password-otp-verify", resetPasswordOtpVerify)
userRouter.put("/reset-password", resetPassword)
userRouter.get("/suggest-user", loginValidation, suggestUser)
userRouter.get("/profile-details/:userId",loginValidation,profileDetails);
userRouter.put("/edit-profile-details",loginValidation, editProfileDetails)
userRouter.put("/upload-profile-picture", upload.single("profilePicture"), loginValidation ,uploadProfilePicture)
export default userRouter