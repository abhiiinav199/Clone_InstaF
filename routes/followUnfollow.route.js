import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { acceptFollowRequest, follow, rejectFollowRequest, unfollow } from "../controllers/followUnfollow.controler.js"
const followUnfollowRouter = express.Router()

followUnfollowRouter.post("/follow", loginValidation, follow)
followUnfollowRouter.delete("/unfollow", loginValidation, unfollow)
followUnfollowRouter.post("/accept-follow-request", loginValidation, acceptFollowRequest)
followUnfollowRouter.delete("/reject-follow-request", loginValidation, rejectFollowRequest)

export default followUnfollowRouter