import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { createComment } from "../controllers/comments.controller.js"

const commentRouter = express.Router()

commentRouter.post("/create-comment", loginValidation, createComment)

export default commentRouter