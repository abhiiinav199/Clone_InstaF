import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    media: [{ // Array to store multiple media items
        postUrl: {
            type: String,
            required: true
        },
        postId: {          // Storing cloudinary publicId(after uploading cloudinary returns publicId for each image/video) so that while deleting it will also delete from cloudinary
            type: String,
            required: true
        },
        postType: {
            type: String,
            enum: ["image", "video"],
            required: true
        }
    }],
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
    postDescription:{
        type: String,
        trim: true,
    }
}, { timestamps: true })

const PostModel = mongoose.model("Post", postSchema)

export default PostModel