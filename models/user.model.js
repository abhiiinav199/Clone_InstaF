import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userName: { 
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },

}, { timestamps: true })

const UserModel = mongoose.model("User", userSchema)

export default UserModel