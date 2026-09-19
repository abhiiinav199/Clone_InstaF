import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { acceptFollowRequest, follow, rejectFollowRequest, removeFollower, removeFollowRequest, unfollow } from "../controllers/followUnfollow.controler.js"
const followUnfollowRouter = express.Router()

followUnfollowRouter.post("/follow", loginValidation, follow)
followUnfollowRouter.delete("/unfollow", loginValidation, unfollow)
followUnfollowRouter.put("/accept-follow-request", loginValidation, acceptFollowRequest)
followUnfollowRouter.delete("/reject-follow-request/:targetUserId", loginValidation, rejectFollowRequest)
followUnfollowRouter.delete("/remove-follow-request/:targetUserId", loginValidation, removeFollowRequest)
followUnfollowRouter.delete("/remove-follower/:targetUserId", loginValidation, removeFollower)

export default followUnfollowRouter