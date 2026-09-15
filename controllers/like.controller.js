import LikeModel from "../models/like.model.js";
import PostModel from "../models/post.model.js";

export const likePost = async (req, res) => {
  try {
    //fetch userId and postId
    const { postId } = req.body;
    const userId = req.user.userId;

    //validation
    if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Something went wrong while fetching details",
      });
    }

    // post exists
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Post not found",
      });
    }
    // already liked
    const liked = await LikeModel.findOne({ post: postId, user: userId });
    if (liked) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "You have already liked this post",
      });
    }

    //like create
    const newLike = await LikeModel.create({ user: userId, post: postId });
    // update post
    const updatedPost = await PostModel.findByIdAndUpdate(postId,{
        $addToSet:{likes:newLike._id}
    }, {new : true})

    // return response
    return res.status(200).json({
        success:true,
        error:false,
        message: "Post liked successfully",
        data: updatedPost,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};
