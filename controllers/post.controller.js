import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";
import {
  cloudinaryUpload,
  deletePostCloudinary,
} from "../utils/cloudinaryUpload.js";

// check file is supported or not
const isFileTypeSupported = (fileType, supportTypes) => {
  return supportTypes.includes(fileType);
};

export const postUpload = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "Please select the file",
        success: false,
        error: true,
      });
    }

    const { postDescription = "" } = req.body;

    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        message: "Something went wrong during fetching userId",
        success: false,
        error: true,
      });
    }

    // Extract name and filetype dynamically from each file- Extract details
    const fileDetails = files.map((file) => ({
      originalName: file.originalname, // "photo1.jpg"
      mimeType: file.mimetype, // "image/jpeg", "video/mp4"
      fileType: file.mimetype.split("/")[0], // "image" or "video"
      extension: file.originalname.split(".").pop().toLowerCase(), // "jpg", "mp4", "png"
      size: file.size, // size in bytes
      buffer: file.buffer, // actual file data
    }));

    console.log(fileDetails);

    const supportTypes = [
      "jpg",
      "jpeg",
      "png",
      "mp4",
      "gif",
      "webp",
      "svg",
      "mov",
      "webm",
      "avi",
      "mkv",
    ];

    // Validation: check every file extension
    if (
      !fileDetails.every((file) =>
        isFileTypeSupported(file.extension, supportTypes),
      )
    ) {
      return res.status(400).json({
        message: "File type is not supported",
        success: false,
        error: true,
      });
    }

    // ✅ loop over each file, convert buffer to base64, upload one by one but it will take more time to upload so better use Promise.all because it will upload all files in parallel without blocking the main thread(server)
    // const uploadedFiles = []

    // for (const fileDetail of fileDetails) {
    //     const base64 = `data:${fileDetail.mimeType};base64,${fileDetail.buffer.toString("base64")}`
    //     const result = await cloudinaryUpload(base64, process.env.CLOUDINARY_FOLDER_NAME)
    //     uploadedFiles.push(result)
    // }

    // ✅ Parallel upload using Promise.all (Super Fast)
    const uploadedFiles = await Promise.all(
      fileDetails.map((fileDetail) => {
        const base64 = `data:${fileDetail.mimeType};base64,${fileDetail.buffer.toString("base64")}`;
        return cloudinaryUpload(base64, process.env.CLOUDINARY_FOLDER_NAME);
      }),
    );

    // ✅ Map uploadedFiles to the new 'media' schema structure
    const mediaArray = uploadedFiles.map((file) => ({
      postUrl: file.secure_url,
      postId: file.public_id,
      postType: file.resource_type === "video" ? "video" : "image",
    }));

    // ✅ save all uploaded file URLs and IDs
    const newPost = await PostModel.create({
      user: userId,
      postDescription: postDescription,
      media: mediaArray,
      // postUrl: uploadedFiles[0].secure_url,   // or store as array if you update the schema
      // postId: uploadedFiles[0].public_id,     // ✅ now correctly saving public_id
      // postType: uploadedFiles[0].resource_type === "video" ? "video" : "image"
    });

    const hasVideo = uploadedFiles.some((f) => f.resource_type === "video");
    const hasImage = uploadedFiles.some((f) => f.resource_type === "image");

    // let mediaType = hasVideo && hasImage ? "Post" : hasVideo ? "Video" : "Image"
    let mediaType =
      hasVideo && hasImage
        ? "Post"
        : hasVideo
          ? "Video"
          : hasImage
            ? "Image"
            : "No media"; // Fallback when there is neither video nor image

    return res.status(200).json({
      message: `${mediaType} uploaded successfully`,
      success: true,
      error: false,
      data: newPost,
    });

    // const uploadPost = await cloudinaryUpload(files, process.env.CLOUDINARY_FOLDER_NAME)

    //  const newPost= await PostModel.create({
    //     user: userId,
    //     postDecription: postDescription,
    //     postUrl: uploadPost.secure_url,
    //     postId: uploadPost.public_id,
    //     postType: uploadPost.resource_type

    //  })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId, postDescription = "" } = req.body;

    //validation
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Something went wrong during fetching postID",
      });
    }

    //getting userId from middleware from authorization.js(middleware folder)
    const userId = req.user?.userId;

    //validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Something went wrong during fetching userID",
      });
    }

    //check post exist or not
    const existingPost = await PostModel.findById(postId);

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Post not found",
      });
    }

    //check userId and post owner is same or not
    if (existingPost?.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You are not authorized to edit this post",
      });
    }

    //update post
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: { postDescription: postDescription },
      },
      { new: true },
    );

    //checking media if it contains video then it's a reel else post
    const updatedPostType = updatedPost.media.some(
      (m) => m.postType === "video",
    )
      ? "Reel"
      : "Post";

    return res.status(200).json({
      message: `${updatedPostType} updated successfully`,
      success: true,
      error: false,
      data: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    //validation
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Something went wrong during fetching postID",
      });
    }

    //getting userId from middleware from authorization.js(middleware folder)
    const userId = req.user?.userId;

    //validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Something went wrong during fetching userID",
      });
    }

    //check post exist or not
    const existingPostDB = await PostModel.findById(postId);

    if (!existingPostDB) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Post not found",
      });
    }

    //check userId and post owner is same or not
    if (existingPostDB?.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You are not authorized to delete this post",
      });
    }

    const result = await Promise.all(
      existingPostDB?.media.map((media) =>
        deletePostCloudinary(media?.postId, media?.postType),
      ) ?? [],
    );

    //delete post
    const deletedPost = await PostModel.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
      error: false,
      data: deletedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const homePage = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const userId = req.user.userId;

    const userDetails = await UserModel.findById(userId);

    let allPost;

    if (userDetails.following.length > 0) {


      const allusersIdsArr = [...userDetails.following, userDetails._id];
//same code as above
      // const allusersIdsArr = userDetails.following;
      // allusersIdsArr.push(userDetails._id);


      allPost = await PostModel.find({
      user: { $in: allusersIdsArr },
    })
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit).populate("user","accountPrivate following followers pendingFollowersRequest profilePicture userName _id").populate({
            path:"likes",
            populate:{
                path:"user"
            }
        }).populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();
    }
    else{
      const trendingAllPost = await PostModel.find({}).sort({createdAt: -1}).skip(skip).limit(limit).populate("user","accountPrivate following followers pendingFollowersRequest profilePicture userName _id")
        .populate({
            path:"likes",
            populate:{
                path:"user"
            }
        }).populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();

         allPost = trendingAllPost.filter((post)=>  post.user && post.user.accountPrivate === false);
    }

     // return response
    return res.status(200).json({
        success:true,
        message:'Successfully fetched posts',
        data: allPost
    })
    
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
