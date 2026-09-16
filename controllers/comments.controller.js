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
      return res
        .status(400)
        .json({
          error: true,
          success: false,
          message: "Please fill all input fields",
        });
    }

    //post exists
    const post = await PostModel.findById(postId)

    // validation
    if(!post){
        return res.status(400).json({
            error: true,
            success: false,
            message: "Post not found"
        })
    }

    //create comment
    const newComment = await CommentModel.create({
        post: postId,
        user: userId,
        comment: commentDesc
    })

    //update post
    const updatedPost= await PostModel.findByIdAndUpdate(postId,{  
        $addToSet:{comments: newComment._id}
    }, {new : true}).populate({
        path: "likes",  //likes: Array of like IDs.
        populate:{
            path: "user"  //Liker (Jis bande ne Like kiya hai).
        }
    }).populate("user")   //Post Creator -Post ka Owner (Jisne photo/post dali hai).
    .populate({
        path: "comments",      
        populate:{
            path: "user", //Comment karne wale ki details
            select: "userName profilePicture"
        } 
    }).exec()

    // return response
        return res.status(200).json({
            success:true,
            message:"Comment created successfully",
            updatedPost:updatedPost,
            newComment:newComment,
        })


  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
