import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";

export const profileDetails = async (req, res) => {
  try {
    // fetch id
    const userId = req.params;
    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong while fetching user profile",
      });
    }

    const [userDetails, userAllPosts] = await Promise.all([
      UserModel.findById(userId)
        .populate("following")
        .populate("followers")
        .exec(),

      PostModel.find({ user: userId })
        .populate({
          path: "likes",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .exec(),
    ]);

    if (!userDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "Successfully fetched profile details",
      data: {
        userDetails: userDetails,
        userAllPosts: userAllPosts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};

export const editProfileDetails = async (req, res) => {
  try {
    const { about, dateOfBirth } = req.body;

    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong while fetching user profile",
      });
    }
    const updateFields = {};
    if (about !== undefined) updateFields.about = about;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;

    // update userDetails
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {$set: updateFields},
      { new: true },
    ).select("-password");

    // return response
    return res.status(200).json({
      error: false,
      success: true,
      message: "Profile details updated successfully.",
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
