

export const postUpload = async (req, res)=>{
    try {
        const {post} = req.files

        if(!post){
            return res.status(400).json({
                message: "Please select the file",
                success: false,
                error: true
            })
        }

        const {postDescription= ""} = req.body
        
        const userId= req.user.userId

        if(!userId){
            return res.status(400).json({
                message: "Please login first",
                success: false,
                error: true
            })
        }

    } catch (error) {
        
    }
}