import cloudinary from "../config/cloudinary.js"

//post upload function
export const cloudinaryUpload= async (file,folder, height, width)=>{
    try {
        const options ={
            folder: folder,
            resource_type: "auto"
        }
        if(height){
            options.height= height
        }

        if(width){
            options.width= width
        }
        return await cloudinary.uploader.upload
        (file,tempFilePath, options)
    
    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            error: true,
             success: false
        })
    }
}


//post delete function
export const deletePost= async(postId)=>{
    try {
        const result= await cloudinary.uploader.destroy(postId)
        return result
    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            error: true,
             success: false
        })
    }
}
