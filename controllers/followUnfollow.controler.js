
export const follow= async (req, res) =>{
    try {
        //target userId
        const {targetUserId} = req.body
        
        //current userId
        const {currentUserId}= req.user

        //validation
        // self follow prevention
        //already Follow
        //if userAccount Private ? followRequest me dalenge current user ki id :direct follow
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}