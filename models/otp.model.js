import mongoose from "mongoose"
import { sendMail } from "../utils/mail.js"
import { verifyEmailTemplate } from "../utils/verifyEmailTemplate.js"

const otpSchema = new mongoose.Schema({
    otp:{
        type:Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 5 *60
    }
})

//function to send otp
const otpSendMail = async(otp, email)=>{
    await sendMail(email, "Insta_CloneF Verification", verifyEmailTemplate(email,otp))
}

//sending mail before saving otp 
otpSchema.pre("save", async function(next){
await otpSendMail(this.otp, this.email)
next()
})

const OtpModel = mongoose.model("Otp", otpSchema)
export default OtpModel