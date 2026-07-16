import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    postUrl: {
        type: String,
        required: true
    },
    postId: {          //Storing cloudinary publicId so that while deleting it will also delete from cloudinary
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    postDecription:{
        type: String,
        trim: true,
    },
    postType:{
        type:  String,
        enum: ["image", "video"],
        required: true
    }
}, { timestamps: true })

const PostModel = mongoose.model("Post", postSchema)

export default PostModel