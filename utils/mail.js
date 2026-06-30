import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config({})

export const sendMail= async(email, subject,body)=>{
    try {
        const transporter= nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info= await transporter.sendMail({
            from: Clone_InstaF,
            to: email,
            subject: subject,
            html: body
        })
        return info
    } catch (error) {
        return res.status(500).json({ 
            message: "Error occur during sending mail" || error.message || error,
            error: true,
            success: false
        })
    }
}