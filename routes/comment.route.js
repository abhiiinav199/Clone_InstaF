import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { createComment, deleteComment } from "../controllers/comments.controller.js"

const commentRouter = express.Router()

commentRouter.post("/create-comment", loginValidation, createComment)
commentRouter.delete("/delete-comment", loginValidation, deleteComment)


export default commentRouter