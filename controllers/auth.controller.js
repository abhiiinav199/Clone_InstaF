import UserModel from "../models/user.model.js"
import otpgenerator from "otp-generator"
import OtpModel from "../models/otp.model.js"
import { hashingPassword } from "../utils/hashingPassword.js"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"


//save otp in db and used pre method in OtpModel to send mail before saving data in db 
export const otpSave = async (req, res) => {
    try {
        // fetch email
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Something went wrong during fetching email"
            })
        }
        // find user is already registered
        const userExists = await UserModel.findOne({ email: email })

        if (userExists) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User is already registered"
            })
        }
        const otp = otpgenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        //create entry in Db
        const newOtp = await OtpModel.create({ email: email, otp: otp })

        return res.status(200).json({
            error: false,
            success: true,
            message: "Otp sent successfully",
            otp: newOtp
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const signUp = async (req, res) => {
    try {
        const { userName, email, password, otp } = req.body

        //validation
        if (!userName || !email || !password || !otp) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            })
        }

        //check if user already exists or not
        const existedUser = await UserModel.findOne({ email: email })
        if (existedUser) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Email already registered"
            })
        }

        const latestOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 })

        if (!latestOtp) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "OTP not found"
            })
        }

        if (latestOtp.otp !== Number(otp)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "OTP not matched"
            })
        }

        const hashedPassword = await hashingPassword(password)

        //generate radnom avatar
        const avatar = `https://api.dicebear.com/10.x/adventurer/svg?seed=${userName}`

        const user = await UserModel.create({
            userName,
            email,
            password: hashedPassword,
            profilePicture: avatar
        })
        return res.status(200).json({
            error: false,
            success: true,
            message: "User created successfully",
            user: user
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        //validation
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            })
        }

        //check user account is created or not
        const user = await UserModel.findOne({ email: email }).select("+password")

        if (!user) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Email is not registered"
            })
        }
        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: "Check your username & password",
                error: true,
                success: false
            })
        }

        //payload for jwt
        const payload = {
            userId: user._id,
            userName: user.userName,
            email: user.email
        }
        const token = await generateToken(payload)

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('token', token, cookiesOptions)

        // while sending token or data you can also use this but always convert toObject() before setting data
        const u = user.toObject()
        u.token = token
        u.password = undefined
        return res.status(200).json({
            message: "Login Successfully",
            error: false,
            success: true,
            user: u
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//reset password form- fetch email, send otp
export const resetPasswordOtpSend = async (req, res) => {
    try {
        // fetch email
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Something went wrong during fetching email"
            })
        }
        // find user is already registered
        const userExists = await UserModel.findOne({ email: email })

        if (!userExists) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User is not registered"
            })
        }
        const otp = otpgenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        //create entry in Db
        const newOtp = await OtpModel.create({ email: email, otp: otp })

        return res.status(200).json({
            error: false,
            success: true,
            message: "Otp sent successfully",
            otp: newOtp
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//reset password otp verify
export const resetPasswordOtpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            })
        }

        //find latest otp with user email
        const latestOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 })

        if (!latestOtp) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "OTP not found"
            })
        }

        if (latestOtp.otp !== Number(otp)) {
            return res
                .status(400).json({
                    error: true,
                    success: false,
                    message: "OTP not matched"
                })
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "OTP verified successfully"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password, confirmPssword } = req.body
        if (!email || !otp || !password || !confirmPssword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            })
        }
        if (password !== confirmPssword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Password & confirm password not matched"
            })
        }

        //verify otp
        const latestOtp = await OtpModel.find({ email: email }).sort({ createdAt: -1 }).limit(1)

        if (!latestOtp.length) {
            return res.status(404).json({
                message: "OTP is expired",
                error: true,
                success: false
            })
        }

        if (latestOtp[0].otp !== otp) {
            return res.status(400).json({
                message: "OTP is not valid",
                error: true,
                success: false
            })

        }

        const user = await UserModel.findOne({ email: email });

        if (await bcryptjs.compare(password, user.password)) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from existing password",
            })
        }

        const hashedPassword = await hashingPassword(password)


        const updatedUser = await UserModel.findByIdAndUpdate({ email: email }, {
            password: hashedPassword
        }, {
            new: true
        })

        return res.status(200).json({
            error: false,
            success: true,
            message: "Password reset successfully",
            user: updatedUser

        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}