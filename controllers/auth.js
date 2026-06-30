import OtpModel from "../models/otp.model.js"
import UserModel from "../models/user.model.js"


export const otpSave= async(req, res) =>{
    try {
        // fetch email
        const {email} = req.body

        if(!email){
            return res.status(400).json({
                success: false,
                message: "Something went wrong during fetching email"
            })
        }
        // find user is already registered
        const userExists = await UserModel.findOne({email: email})

        if(userExists){
            return res.status(400).json({
                success:false,
                message: "User is already registered"
            })
        }
        const otp = Math.floor(1000 + Math.random() * 9000)
        const otpDocument = new OtpModel({email, otp})
        await otpDocument.save()

        
    } catch (error) {
        return res.status(500).json({ 
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
// export const userRegister = async(req, res) =>{
//     try {
//         const {userName , email, password} = req.body

//         if(!userName || !email || !password){
//         return res.status(400).json({
//                 message : "All fields are required",
//                 error : true,
//                 success : false
//             })
//         }
//         const 
//     } catch (error) {
//         return res.status(500).json({ 
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }