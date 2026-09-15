import cloudinary from "../config/cloudinary.js"

//post upload function
export const cloudinaryUpload = async (file, folder, height, width) => {
    try {
       

        const options = {
            folder: folder,
            resource_type: "auto"
        }
        if (height) {
            options.height = height
        }

        if (width) {
            options.width = width
        }
        return await cloudinary.uploader.upload
            (file, options)

    } catch (error) {
        throw error;
        // return res.status(400).json({
        //     message: error.message || error,
        //     error: true,
        //      success: false
        // })
    }
}


//post delete function
export const deletePostCloudinary = async (postId, resource_type = "image") => {
    try {
        const result = await cloudinary.uploader.destroy(postId, { resource_type: resource_type })
        return result
    } catch (error) {
        throw error
        // return res.status(400).json({
        //     message: error.message || error,
        //     error: true,
        //     success: false
        // })
    }
}
