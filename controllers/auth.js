import UserModel from "../models/user.model.js"
import otpgenerator from "otp-generator"
import OtpModel from "../models/otp.model.js"
import { hashingPassword } from "../utils/hashingPassword.js"

//save otp in db and used pre method in OtpModel to send mail before saving data in db 
export const otpSave= async(req, res) =>{
    try {
        // fetch email
        const {email} = req.body

        if(!email){
            return res.status(400).json({
                error: true,
                success: false,
                message: "Something went wrong during fetching email"
            })
        }
        // find user is already registered
        const userExists = await UserModel.findOne({email: email})

        if(userExists){
            return res.status(400).json({
                error : true,
                success:false,
                message: "User is already registered"
            })
        }
        const otp = otpgenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        //create entry in Db
        const newOtp = await OtpModel.create({email: email, otp:otp})

        return res.status(200).json({
            error:false,
            success:true,
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

export const signUp= async(req, res)=>{
    try {
        const {userName, email, password, otp} = req.body

        //validation
        if(!userName || !email || !password || !otp){
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            })
        }

        //check if user already exists or not
        const existedUser = UserModel.findOne({email: email})
        if(existedUser){
            return res.status(400).json({
                error: true,
                success: false,
                message: "Email already registered"
            })
        }

        const latestOtp = await OtpModel.findOne({email}).sort({createdAt: -1})

        if(!latestOtp){
            return res.status(4000).json({
                error: true, 
                success: false,
                message: "OTP not found"
            })
        }

        if(latestOtp !== otp){
            return res.status(400).json({
                error: true,
                success: false,
                message: "OTP not matched"
            })
        }
        
        const hashedPassword= await hashingPassword(password)

        const user = await UserModel.create({
            userName, 
            email, 
            password: hashedPassword
        })
        return res.status(200).json({
            error:false,
            success:true,
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
