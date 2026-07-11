import UserModel from "../models/user.model.js"

//follow controller
export const follow = async (req, res) => {
    try {
        //target userId
        const { targetUserId } = req.body

        //current userId
        const currentUserId = req.user.userId

        //validation
        if (!targetUserId || !currentUserId) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Something went wrong during fetching Id's"
            })
        }

        // validation- self follow prevention
        if (currentUserId === targetUserId) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "You cannot follow yourself"
            })
        }

        //target userExist or not
        const targetUser = await UserModel.findById(targetUserId)
        if (!targetUser) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found"
            })
        }

        //already Followed
        const currentUser = await UserModel.findById(currentUserId)

        if (currentUser.following.some(id => id.toString() === targetUserId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "You are already following this user"
            })
        }

        if (targetUser.followers.some(id => id.toString() === currentUserId)) {
            return res.status(400).json({
                message: "You are already following this user",
                error: true,
                success: false
            })
        }
        //if userAccount Private ? followRequest me dalenge current user ki id :direct follow
        if (targetUser.accountPrivate) {
            if (targetUser.pendingFollowersRequest.some(id => id.toString() === currentUserId)) {
                return res.status(400).json({
                    message: "You have already sent a follow request to this user",
                    error: true,
                    success: false
                })
            }


            const updatedTargetUser = await UserModel.findByIdAndUpdate(targetUserId, {
                $push: { pendingFollowersRequest: currentUserId }
            }, {
                new: true
            })

            return res.status(200).json({
                message: "Follow request sent successfully",
                error: false,
                success: true,
            })
        }

        //direct follow and update targetUser
        const updatedTargetedUser = await UserModel.findByIdAndUpdate(targetUserId, {
            $push: { followers: currentUserId },
        }, {
            new: true
        })

        //update current user 
        const updatedCurrentUser = await UserModel.findByIdAndUpdate(currentUserId, {
            $push: { following: targetUserId }
        }, {
            new: true
        })

        return res.status(200).json({
            message: "User followed successfully",
            error: false,
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//unfollow controller
export const unfollow = async (req, res) => {
    try {
        const { targetUserId } = req.body

        //current userId-getting from middleware
        const currentUserId = req.user.userId

        //validation
        if (!targetUserId || !currentUserId) {
            return res.status(400).json({
                message: "Invalid reques. Both current user ID and target user ID are required",
                error: true,
                successL: false
            })
        }

        //self unfollow prevention 
        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: "Invalid request",
                error: true,
                success: false
            })
        }

        // target userExist
        const targetUser = await UserModel.findById(targetUserId)
        if (!targetUser) {
            return res.status(404).json({
                message: "The user your are trying to follow does not exist",
                error: true,
                success: false
            })
        }

        if (!targetUser.followers.includes(currentUserId)) {
            return res.status(400).json({
                message: "You are not following this user",
                error: true,
                success: false
            })
        }

        const currentUser = await UserModel.findyById(currentUserId)

        if (!currentUser.following.includes(targetUserId)) {
            return res.status(400).json({
                message: "You are not following this user",
                error: true,
                success: false
            })
        }

        // update target user- removing 
        const updatedTargetUser = await UserModel.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId }
        }, { new: true })

        //update current user- removing
        const updateCurrentUser = await UserModel.findByIdAndUpdate(currentUserId, {
            $pull: { following: targetUserId }
        }, { new: true })

        return res.status(200).json({
            message: "User unfollowed successfully",
            error: false,
            success: true,
        })



    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//accept follow request
export const acceptFollowRequest = async (req, res) => {
    try {
        //target userId-> jisne tumko request bheja hai
        const { targetUserId } = req.body

        //current userId
        const currentUserId = req.user.userId

        //validation
        if (!targetUserId || !currentUserId) {
            return res.status(400).json({
                message:
                    "Invalid request. Both current user ID and target user ID are required",
                error: true,
                successL: false
            })
        }

        //self-follow prevetion
        // if (currentUserId === targetUserId) {
        //     return res.status(400).json({
        //         message: "You cannot follow yourself",
        //         error: true,
        //         success: false
        //     })
        // }

        //target userExist or not
        const targetUser = await UserModel.findById(targetUserId)

        if (!targetUser) {
            return res.status(404).json({
                message: "The user you are trying to accept follow request does not exist",
                error: true,
                success: false
            })
        }

        //current userExist or Not 
        const currentUser = await UserModel.findById(currentUserId)

        //already followed check
        if (currentUser.followers.some(id => id.toString() === targetUserId)) {
            return res.status(400).json({
                message: `${targetUser.userName} is already following you`,
                error: true,
                success: false
            })
        }
        //already followed check
        if (targetUser.following.some(id => id.toString() === currentUserId)) {
            return res.status(400).json({
                message: `You are already following ${targetUser.userName}`,
                error: true,
                success: false
            })
        }

        if (!currentUser.pendingFollowersRequest.includes(targetUserId)) {
            return res.status(404).json({
                message: "Follow request not found",
                error: true,
                success: false
            })
        }

        //  accept follow request update both user
        const updatedCurrentUser = await User.findByIdAndUpdate(currentUserId, {
            $push: { follwers: targetUserId },
            $pull: { pendingFollowersRequest: targetUserId }
        }, { new: true });


        const updatedTargetUser = await User.findByIdAndUpdate(targetUserId, {
            $push: { following: currentUserId }
        }, { new: true });

        // return response 
        return res.status(200).json({
            success: true,
            message: "Follow request accept successfully",
            updatedCurrentUser: updatedCurrentUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}

//reject follow request
export const rejectFollowRequest = async (req, res) => {
    try {
        // target userId -> jisne tumko follow request bheja hai 
        const {targetUserId} = req.params;

        // current userId 
        const currentUserId = req.user.userId;

        // validation
        if(!targetUserId || !currentUserId){
            return res.status(400).json({
                success:false,
                message:"Invalid request. Both current user ID and target user ID are required."
            })
        }


        if(currentUserId === targetUserId){
            return res.status(400).json({
                success:false,
                message:"both userId is same"
            })
        }

        const currentUser = await User.findById(currentUserId);
         
        if(!currentUser.pendingFollowersRequest.includes(targetUserId)){
           return res.status(404).json(({
            succees:false,
            message:"Follow requset not found"

           }))
        }

        //  update the  current user
        const updatedUser = await User.findByIdAndUpdate(currentUserId,{
            $pull:{pendingFollowersRequest:targetUserId}
        },{new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"Follow request reject successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

