import mongoose from "mongoose";
import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";
import {
  cloudinaryUpload,
  deletePostCloudinary,
} from "../utils/cloudinaryUpload.js";

// export const profileDetails = async (req, res) => {
//   try {
//     // fetch id
//     const {userId} = req.params;
//     if (!userId) {
//       return res.status(400).json({
//         error: true,
//         success: false,
//         message: "Something went wrong while fetching user profile",
//       });
//     }

//     const [userDetails, userAllPosts] = await Promise.all([
//       UserModel.findById(userId)
//         .populate("following")
//         .populate("followers")
//         .exec(),

//       PostModel.find({ user: userId })
//         .populate({
//           path: "likes",
//           populate: {
//             path: "user",
//           },
//         })
//         .populate({
//           path: "comments",
//           populate: {
//             path: "user",
//           },
//         })
//         .exec(),
//     ]);
//     // all userImages
//    const allImages = await PostModel.aggregate([
//   {
//     $match: {
//       user:new mongoose.Types.ObjectId(userId),
//       "media.postType": "image",
//     },
//   },
//   {
//     $project: {
//       user: 1,
//       likes: 1,
//       comments: 1,
//       postDescription: 1,
//       createdAt: 1,
//       updatedAt: 1,
//       media: {
//         $filter: {
//           input: "$media",
//           as: "item",
//           cond: {
//             $eq: ["$$item.postType", "image"],
//           },
//         },
//       },
//     },
//   },
// ]);

// await PostModel.populate(allImages, [
//   {
//     path: "likes",
//     populate: {
//       path: "user",
//     },
//   },
//   {
//     path: "comments",
//     populate: {
//       path: "user",
//     },
//   },
//   {
//     path: "user",
//   },
// ]);


// const allReels = await PostModel.find({user:userId, "media.postType": "video" }).populate({
//             path:"likes",
//             populate:{
//                 path:"user"
//             }
//         }).populate({
//             path:"comments",
//             populate:{
//                 path:"user"
//             }
//         }).populate("user").exec();

//  // set user password undefined
//         userDetails.password = undefined;
        
//         // set user followers password undefined
//         if(userDetails.followers.length){
//             userDetails.followers.forEach((user) => {
//                 user.password = undefined;
//             })
//         }

//          // set user following user password undefined
//         if(userDetails.following.length){
//             userDetails.following.forEach((user) => {
//                 user.password = undefined;
//             })
//         }
//     if (!userDetails) {
//       return res.status(404).json({
//         error: true,
//         success: false,
//         message: "User not found",
//       });
//     }
//      // return response
//         return res.status(200).json({
//             success:true,
//             message:"Successfully fetched profile details",
//             userDetails:userDetails,
//             allPosts:userAllPosts,
//             allImages:allImages,
//             allReels:allReels,

//         })
//   } catch (error) {
//     return res.status(500).json({
//       error: true,
//       success: false,
//       message: error.message || error,
//     });
//   }
// };

import mongoose from "mongoose";
import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";

export const profileDetails = async (req, res) => {
  try {
    // ✅ 1. Destructure userId string from req.params
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong while fetching user profile",
      });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Parallel fetch: User details & all posts
    const [userDetails, userAllPosts] = await Promise.all([
      UserModel.findById(userId)
        .select("-password")
        .populate("following", "userName profilePicture accountPrivate")
        .populate("followers", "userName profilePicture accountPrivate")
        .exec(),

      PostModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "likes",
          populate: { path: "user", select: "userName profilePicture" },
        })
        .populate({
          path: "comments",
          populate: { path: "user", select: "userName profilePicture" },
        })
        .populate("user", "userName profilePicture")
        .exec(),
    ]);

    // ✅ Null check before accessing properties
    if (!userDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    // Filter images and reels directly in JS or separate queries
    // Filter Images from userAllPosts
    const allImages = userAllPosts.filter((post) =>
      post.media.some((item) => item.postType === "image")
    );

    // Filter Reels from userAllPosts
    const allReels = userAllPosts.filter((post) =>
      post.media.some((item) => item.postType === "video")
    );

    // ✅ Return response
    return res.status(200).json({
      error: false,
      success: true,
      message: "Successfully fetched profile details",
      userDetails: userDetails,
      allPosts: userAllPosts,
      allImages: allImages,
      allReels: allReels,
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
      error: false,
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

//remove profile picture
export const removeProfilePicture = async (req, res) => {
  try {
    //fetch userId from middleware
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong during fetching details",
      });
    }

    const userDetails = await UserModel.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    // Delete old picture from Cloudinary if exists
    if (userDetails.profilePictureId) {
      await deletePostCloudinary(userDetails.profilePictureId);
    }

    // Default avatar if DP removed
    const defaultAvatar = `https://api.dicebear.com/10.x/adventurer/svg?seed=${userDetails.userName}`;

    // update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePicture: defaultAvatar,
        profilePictureId: null,
      },
      { new: true },
    )
      .select("-password")
      .populate("following")
      .populate("followers")
      .exec();

    // return response
    return res.status(200).json({
      error: false,
      success: true,
      message: "Profile picture removed successfully",
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
