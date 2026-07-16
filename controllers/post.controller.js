import PostModel from "../models/post.model.js"
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js"

// check file is supported or not
const isFileTypeSupported = (fileType, supportTypes) => {
    return supportTypes.includes(fileType)
}

export const postUpload = async (req, res) => {
    try {
        const files = req.files

        if (!files || files.length === 0) {
            return res.status(400).json({
                message: "Please select the file",
                success: false,
                error: true
            })
        }

        const { postDescription = "" } = req.body

        const userId = req.user.userId

        if (!userId) {
            return res.status(400).json({
                message: "Something went wrong during fetching userId",
                success: false,
                error: true
            })
        }


        // Extract name and filetype dynamically from each file
        const fileDetails = files.map(file => ({
            originalName: file.originalname,                  // "photo1.jpg"
            mimeType: file.mimetype,                          // "image/jpeg", "video/mp4"
            fileType: file.mimetype.split("/")[0],            // "image" or "video"
            extension: file.originalname.split(".").pop().toLowerCase(),   // "jpg", "mp4", "png"
            size: file.size,                                  // size in bytes
            buffer: file.buffer                               // actual file data
        }))

        console.log(fileDetails)

        const supportTypes = ["jpg", "jpeg", "png", "mp4", "gif", "webp", "svg", "mov", "webm", "avi", "mkv"]

        if (!fileDetails.every(file => isFileTypeSupported(file.extension, supportTypes))) {
            return res.status(400).json({
                message: "File type is not supported",
                success: false,
                error: true
            })
        }

        
        // ✅ loop over each file, convert buffer to base64, upload one by one
        const uploadedFiles = []
        
        for (const fileDetail of fileDetails) {
            const base64 = `data:${fileDetail.mimeType};base64,${fileDetail.buffer.toString("base64")}`
            const result = await cloudinaryUpload(base64, process.env.CLOUDINARY_FOLDER_NAME)
            uploadedFiles.push(result)
        }
        
        // ✅ save all uploaded file URLs and IDs
        const newPost = await PostModel.create({
            user: userId,
            postDecription: postDescription,
            postUrl: uploadedFiles[0].secure_url,   // or store as array if you update the schema
            postId: uploadedFiles[0].public_id,     // ✅ now correctly saving public_id
            postType: uploadedFiles[0].resource_type === "video" ? "video" : "image"
        })
        
        // const uploadPost = await cloudinaryUpload(files, process.env.CLOUDINARY_FOLDER_NAME)

        //  const newPost= await PostModel.create({
        //     user: userId,
        //     postDecription: postDescription,
        //     postUrl: uploadPost.secure_url,
        //     postId: uploadPost.public_id,
        //     postType: uploadPost.resource_type

        //  })

        return res.status(200).json({

            message: "Post uploaded successfully",
            success: true,
            error: false,
            data: newPost
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}