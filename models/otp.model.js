import mongoose from "moongoose"

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