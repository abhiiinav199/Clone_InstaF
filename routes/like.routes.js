import express from "express"
import { likePost, unlikePost } from "../controllers/like.controller.js"
import { loginValidation } from "../middlewares/Authorization.js"

const likeRouter = express.Router()

likeRouter.post("/like-post", loginValidation, likePost)
likeRouter.delete("/unlike-post", loginValidation, unlikePost)

export default likeRouter