import UserModel from "../models/user.model.js";

//follow controller
export const follow = async (req, res) => {
  try {
    //target userId
    const { targetUserId } = req.body;

    //current userId
    const currentUserId = req.user.userId;

    //validation
    if (!targetUserId || !currentUserId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching Id's",
      });
    }

    // validation- self follow prevention
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "You cannot follow yourself",
      });
    }

    //target user & current user exist or not concurrently
    const [targetUser, currentUser] = await Promise.all([
      UserModel.findById(targetUserId),
      UserModel.findById(currentUserId),
    ]);

    if (!targetUser) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    //another way of checking using equals() method of mongoose which is available for mongodb objects(in this case Id's are objectId's)
    // if (currentUser.following.some(id => id.equals(targetUserId)))

    //if we dont use equals() method then we have to convert it to string
    if (currentUser.following.some((id) => id.toString() === targetUserId)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "You are already following this user",
      });
    }

    //another way of checking using equals() method of mongoose which is available for mongodb objects(in this case Id's are objectId's)
    // if (targetUser.followers.some(id => id.equals(currentUserId)))

    //if we dont use equals() method then we have to convert it to string
    if (targetUser.followers.some((id) => id.toString() === currentUserId)) {
      return res.status(400).json({
        message: "You are already following this user",
        error: true,
        success: false,
      });
    }
    //if userAccount Private ? followRequest me dalenge current user ki id :direct follow
    if (targetUser.accountPrivate) {
      if (
        targetUser.pendingFollowersRequest.some(
          (id) => id.toString() === currentUserId,
        )
      ) {
        return res.status(400).json({
          message: "You have already sent a follow request to this user",
          error: true,
          success: false,
        });
      }

      const updatedTargetUser = await UserModel.findByIdAndUpdate(
        targetUserId,
        {
          $addToSet: { pendingFollowersRequest: currentUserId },
        },
        {
          new: true,
        },
      );

      return res.status(200).json({
        message: "Follow request sent successfully",
        error: false,
        success: true,
      });
    }

    //direct follow and update targetUser -This is Sequential query, instead of this used Promise.all()

    // const updatedTargetedUser = await UserModel.findByIdAndUpdate(
    //   targetUserId,
    //   {
    //     $addToSet: { followers: currentUserId },
    //   },
    //   {
    //     new: true,
    //   },
    // );

    // //update current user
    // const updatedCurrentUser = await UserModel.findByIdAndUpdate(
    //   currentUserId,
    //   {
    //     $addToSet: { following: targetUserId },
    //   },
    //   {
    //     new: true,
    //   },
    // );
    // ✅ Parallel DB Updates using Promise.all
    const [updatedTargetedUser, updatedCurrentUser] = await Promise.all([
      UserModel.findByIdAndUpdate(
        targetUserId,
        {
          $addToSet: { followers: currentUserId },
        },
        { new: true },
      ),
      UserModel.findByIdAndUpdate(
        currentUserId,
        {
          $addToSet: { following: targetUserId },
        },
        { new: true },
      ),
    ]);

    return res.status(200).json({
      message: "User followed successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//unfollow controller
export const unfollow = async (req, res) => {
  try {
    const { targetUserId } = req.body;

    //current userId-getting from middleware
    const currentUserId = req.user.userId;

    //validation
    if (!targetUserId || !currentUserId) {
      return res.status(400).json({
        message:
          "Invalid request. Both current user ID and target user ID are required",
        error: true,
        success: false,
      });
    }

    //self unfollow prevention
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "Invalid request",
        error: true,
        success: false,
      });
    }

    // target userExist
    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        message: "The user your are trying to unfollow does not exist",
        error: true,
        success: false,
      });
    }

    if (!targetUser.followers.some((id) => id.toString() === currentUserId)) {
      return res.status(400).json({
        message: "You are not following this user",
        error: true,
        success: false,
      });
    }

    const currentUser = await UserModel.findById(currentUserId);

    if (!currentUser.following.some((id) => id.toString() === targetUserId)) {
      return res.status(400).json({
        message: "You are not following this user",
        error: true,
        success: false,
      });
    }

    // update target user- removing(Sequential query, instead use Promise.all())
    // const updatedTargetUser = await UserModel.findByIdAndUpdate(
    //   targetUserId,
    //   {
    //     $pull: { followers: currentUserId },
    //   },
    //   { new: true },
    // );

    //update current user- removing(Sequential query, instead use Promise.all())
    // const updateCurrentUser = await UserModel.findByIdAndUpdate(
    //   currentUserId,
    //   {
    //     $pull: { following: targetUserId },
    //   },
    //   { new: true },
    // );
    // ✅ Parallel DB Updates using Promise.all
    const [updatedTargetUser, updatedCurrentUser] = await Promise.all([
      UserModel.findByIdAndUpdate(
        targetUserId,
        {
          $pull: { followers: currentUserId },
        },
        { new: true },
      ),
      UserModel.findByIdAndUpdate(
        currentUserId,
        {
          $pull: { following: targetUserId },
        },
        { new: true },
      ),
    ]);

    return res.status(200).json({
      message: "User unfollowed successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//accept follow request
export const acceptFollowRequest = async (req, res) => {
  try {
    //target userId-> jisne tumko request bheja hai
    const { targetUserId } = req.body;

    //current userId
    const currentUserId = req.user.userId;

    //validation
    if (!targetUserId || !currentUserId) {
      return res.status(400).json({
        message:
          "Invalid request. Both current user ID and target user ID are required",
        error: true,
        success: false,
      });
    }

    //self-follow prevetion
    // if (currentUserId === targetUserId) {
    //     return res.status(400).json({
    //         message: "You cannot follow yourself",
    //         error: true,
    //         success: false
    //     })
    // }

    //target user & current user exist or not concurrently
    const [targetUser, currentUser] = await Promise.all([
      UserModel.findById(targetUserId),
      UserModel.findById(currentUserId),
    ]);

    if (!targetUser) {
      return res.status(404).json({
        message:
          "The user you are trying to accept follow request does not exist",
        error: true,
        success: false,
      });
    }

    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
        error: true,
        success: false,
      });
    }

    //already followed check
    if (currentUser.followers.some((id) => id.toString() === targetUserId)) {
      return res.status(400).json({
        message: `${targetUser.userName} is already following you`,
        error: true,
        success: false,
      });
    }
    //already followed check
    if (targetUser.following.some((id) => id.toString() === currentUserId)) {
      return res.status(400).json({
        message: `You are already following ${targetUser.userName}`,
        error: true,
        success: false,
      });
    }

    if (
      !currentUser.pendingFollowersRequest.some(
        (id) => id.toString() === targetUserId,
      )
    ) {
      return res.status(404).json({
        message: "Follow request not found",
        error: true,
        success: false,
      });
    }

    //  accept follow request update both user but it's sequential so this query will take time. so, better approach is done below using Promise.all()
    // const updatedCurrentUser = await UserModel.findByIdAndUpdate(
    //   currentUserId,
    //   {
    //     $addToSet: { followers: targetUserId },
    //     $pull: { pendingFollowersRequest: targetUserId },
    //   },
    //   { new: true },
    // );

    // const updatedTargetUser = await UserModel.findByIdAndUpdate(
    //   targetUserId,
    //   {
    //     $addToSet: { following: currentUserId },
    //   },
    //   { new: true },
    // );

    const [updatedCurrentUser, updatedTargetUser] = await Promise.all([
      UserModel.findByIdAndUpdate(
        currentUserId,
        {
          $addToSet: { followers: targetUserId },
          $pull: { pendingFollowersRequest: targetUserId },
        },
        { new: true },
      ),
      UserModel.findByIdAndUpdate(
        targetUserId,
        {
          $addToSet: { following: currentUserId },
        },
        { new: true },
      ),
    ]);

    // return response
    return res.status(200).json({
      success: true,
      message: "Follow request accept successfully",
      updatedCurrentUser: updatedCurrentUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//reject follow request
export const rejectFollowRequest = async (req, res) => {
  try {
    // target userId -> jisne tumko follow request bheja hai
    const { targetUserId } = req.params;

    // current userId
    const currentUserId = req.user.userId;

    //validation
    const foundUser = await UserModel.findById(currentUserId);
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // validation
    if (!targetUserId || !currentUserId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid request. Both current user ID and target user ID are required.",
      });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "both userId is same",
      });
    }

    const currentUser = await UserModel.findById(currentUserId);

    if (
      !currentUser.pendingFollowersRequest.some(
        (id) => id.toString() === targetUserId,
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Follow requset not found",
      });
    }

    //  update the  current user
    const updatedUser = await UserModel.findByIdAndUpdate(
      currentUserId,
      {
        $pull: { pendingFollowersRequest: targetUserId },
      },
      { new: true },
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Follow request reject successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//remove follow request
export const removeFollowRequest = async (req, res) => {
  try {
    //fetching targetUserId from params
    const { targetUserId } = req.params;
    //validation
    if (!targetUserId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching targetUserId",
      });
    }
    // fetching id from middleware
    const userId = req.user.userId;
    //validation
    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong while fetching userId",
      });
    }

    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Requested user request not found",
      });
    }

    // check follow request
    if (!targetUser.pendingFollowersRequest.some((id) => id.equals(userId))) {
      //another way- (id) => id.toString() === userId.toString(), instead used mongoDb "equals"
      return res.status(400).json({
        error: true,
        success: false,
        message: "Pending follow request not found.",
      });
    }

    //update target user db
    const updateTargetUser = await UserModel.findByIdAndUpdate(targetUserId, {
      $pull: { pendingFollowersRequest: userId },
    });

    // return response
    return res.status(200).json({
      error: false,
      success: true,
      message: "Successfully removed pending follow request.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};

//remove follower
export const removeFollower = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user.userId;

    if (!targetUserId || !userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching Id's",
      });
    }

    // Parallel fetch both user details
    const [userDetails, targetUserDetails] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(targetUserId),
    ]);
    if (!userDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }
    if (!targetUserDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Target user not found",
      });
    }

    if (!userDetails.followers.some((id) => id.equals(targetUserId))) {
      return res.status(400).json({
        success: false,
        message: "This is not your follower",
      });
    }

    if (!targetUserDetails.following.some((id) => id.equals(userId))) {
      return res.status(400).json({
        success: false,
        message: "This is not your follower",
      });
    }

    //update Both
    await Promise.all([
      UserModel.findByIdAndUpdate(
        userId,
        { $pull: { followers: targetUserId } },
        { new: true },
      ),
      UserModel.findByIdAndUpdate(
        targetUserId,
        { $pull: { following: userId } },
        { new: true },
      ),
    ]);

    return res.status(200).json({
      error: false,
      success: true,
      message: "Successfully removed follower.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};

//get all follow request
export const getAllFollowRequest = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching userId",
      });
    }

    const userDetails = await UserModel.findById(userId)
      .select("pendingFollowersRequest")
      .populate(
        "pendingFollowersRequest",
        "_id userName profilePicture accountPrivate",
      );

    if (!userDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }
    // return response
    return res.status(200).json({
      success: true,
      message: "Successfully fetched allPendingFollowRequests",
      count: userDetails.pendingFollowersRequest.length,
      userDetails: userDetails.pendingFollowersRequest,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
