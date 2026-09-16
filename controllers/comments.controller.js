import CommentModel from "../models/comment.model.js";
import PostModel from "../models/post.model.js";

export const createComment = async (req, res) => {
  try {
    ///fetch userId from middleware
    const userId = req.user.userId;

    const { postId, commentDesc } = req.body;

    //validation
    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching userId",
      });
    }

    //validation
    if (!postId || !commentDesc) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Please fill all input fields",
      });
    }

    //Check post exists
    const post = await PostModel.findById(postId);

    // validation
    if (!post) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Post not found",
      });
    }

    //create comment
    const newComment = await CommentModel.create({
      post: postId,
      user: userId,
      comment: commentDesc,
    });

    //update post
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $addToSet: { comments: newComment._id },
      },
      { new: true },
    )
      .populate({
        path: "likes", //likes: Array of like IDs.
        populate: {
          path: "user", //Liker (Jis bande ne Like kiya hai).
        },
      })
      .populate("user") //Post Creator -Post ka Owner (Jisne photo/post dali hai).
      .populate({
        path: "comments",
        populate: {
          path: "user", //Comment karne wale ki details
          select: "userName profilePicture",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Comment created successfully",
      updatedPost: updatedPost,
      newComment: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    //commentId
    const { commentId } = req.body;

    //userId
    const userId = req.user.userId;

    //validation
    if (!commentId || !userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching userId or commentId",
      });
    }

    //comment exist-Find comment and populate post & post-owner
    const comment = await CommentModel.findById(commentId).populate({
      path: "post",
      populate: {
        path: "user",
      },
    });

    if (!comment) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Comment not found.",
      });
    }

    //check is this comment created by this user or not
    // if(comment.user.toString() !== userId.toString() || comment.post.user.id !== userId.toString()){
    //   return res.status(403).json({
    //     error: true,
    //     success: false,
    //     message: "This comment is not created by you."
    //   })
    // }

    // Parallel execution: Delete comment & Pull from post
    const [, updatedPost] = await Promise.all([
      CommentModel.findByIdAndDelete(commentId),
      PostModel.findByIdAndUpdate(
        comment.post._id, // ✅ using _id because comment is a object with other details included.
        { $pull: { comments: commentId } },
        { new: true },
      )
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
        .populate("user")
        .exec(),
    ]);
    // const deleteComment = await CommentModel.findByIdAndDelete(commentId);

    // //update post
    // const updatedPost = await PostModel.findByIdAndUpdate(
    //   comment.post._id,
    //   {
    //     $pull: { comments: commentId },
    //   },
    //   { new: true },
    // ).populate({
    //     path: "likes",
    //     populate: {
    //       path: "user",
    //     },
    //   })
    //   .populate({
    //     path: "comments",
    //     populate: {
    //       path: "user",
    //     },
    //   })
    //   .populate("user")
    //   .exec();

    //return respone
    return res.status(200).json({
      error: false,
      success: true,
      message: "Comment deleted successfully.",
      updatePost: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
