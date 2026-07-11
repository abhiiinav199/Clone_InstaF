import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required: true,
    },
    comment:{
        type: String,
        trim: true,
        required: true
    }
},{timestamps:true})

const commentModel = mongoose.model("Comment", commentSchema)

export default commentModel