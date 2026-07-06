import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { follow } from "../controllers/followUnfollow.controler.js"
const followUnfollowRouter = express.Router()

followUnfollowRouter.post("/follow", loginValidation, follow)

export default followUnfollowRouter