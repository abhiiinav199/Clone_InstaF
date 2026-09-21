import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";
import {
  cloudinaryUpload,
  deletePostCloudinary,
} from "../utils/cloudinaryUpload.js";

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
      { $set: updateFields },
      { new: true },
    ).select("-password");

    // return response
    return res.status(200).json({
      error: false,
      success: true,
      message: "Profile details updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};

//upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profilePicture = req.file;

    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong while fetching details.",
      });
    }

    if (!profilePicture) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Please select the image.",
      });
    }

    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found.",
      });
    }

    // if profilePictureId not null then delete profile picture from cloudinary
    if (userDetails.profilePictureId) {
      await deletePostCloudinary(userDetails.profilePictureId);
    }

    // Convert buffer to base64
    const base64UploadedFiles = `data:${profilePicture.mimetype};base64,${profilePicture.buffer.toString("base64")}`; // ✅ Fixed: mimetype

    const uploadedProfilePicture = await cloudinaryUpload(
      base64UploadedFiles,
      process.env.CLOUDINARY_FOLDER_NAME,
    );

    // update profile picture
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePicture: uploadedProfilePicture.secure_url,
        profilePictureId: uploadedProfilePicture.public_id,
      },
      { new: true },
    )
      .select("-password")
      .populate("following")
      .populate("followers")
      .exec();

    return res.status(200).json({
      error: true,
      success: true,
      message: "Profile picture updated successfully",
      updatedUser: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
