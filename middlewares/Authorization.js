import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({})
export const loginValidation = (req, res, next)=>{
    try {
        const token = req?.cookies?.token || req?.headers?.authorization?.split(" ")[1] //req.cookies.accessToken is for browser and req?.headers.authorization?.split(" ")[1] is for mobile devices which do not support cookies
        //validation
        if(!token ){
            return res.status(401).json({
                message: "Provide Token",
                error: true,
                success: false
            })
        }
        console.log(token)

        //decoding the token
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode){
            return res.status(401).json({
                message: "Unauthorised Access",
                error: true,
                success: false
            })
        }

        //setting token inside req.userId
        req.user= decode?._id

        next()
    } catch (error) {
        return res.status(403).json({
            message:"Invalid or Expired Token",
            error: true, 
            success: false
        })
    }
}