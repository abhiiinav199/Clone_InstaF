import mongoose from "mongoose";

const likeSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    }
},{timestamps:true})

//index to prevent double like
likeSchema.index({ user: 1, post: 1 }, { unique: true });

const LikeModel= mongoose.model("Like", likeSchema)

export default LikeModel