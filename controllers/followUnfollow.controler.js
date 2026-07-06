import UserModel from "../models/user.model.js"

export const follow = async (req, res) => {
    try {
        //target userId
        const { targetUserId } = req.body

        //current userId
        const currentUserId  = req.user.userId

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
            if (targetUser.pendingFollowersRequest.some(id =>id.toString() === currentUserId)) {
                return res.status(400).json({
                    message: "You have already sent a follow request to this user",
                    error: true,
                    success: false
                })
            }
        

        const updatedTargetUser = await UserModel.findByIdAndUpdate(targetUserId , {
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
        const updatedTargetedUser = await UserModel.findByIdAndUpdate(targetUserId , {
            $push: { followers: currentUserId },
        }, {
            new: true
        })

        //update current user 
        const updatedCurrentUser = await UserModel.findByIdAndUpdate( currentUserId , {
            $push: { following: targetUserId}
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