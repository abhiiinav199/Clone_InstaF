import express from "express"
import { likePost } from "../controllers/like.controller.js"
import { loginValidation } from "../middlewares/Authorization.js"

const likeRouter = express.Router()

likeRouter.post("/like-post", loginValidation, likePost)

export default likeRouter