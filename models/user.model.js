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
        required: true,
        select: false
    },
    about: {
        type: String,
        default: ""
    },
    dateOfBirth: {
        type: String,
    },
    profilePicture:{
        type:String
    },
    accountPrivate:{
        type:Boolean,
        default:false,
        required: true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    pendingFollowersRequest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    // profilePicturId:{
    //     type:String
    // },
    
}, { timestamps: true })

const UserModel = mongoose.model("User", userSchema)

export default UserModel