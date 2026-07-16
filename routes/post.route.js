import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { postUpload } from "../controllers/post.controller.js"
import { upload } from "../middlewares/multer.js"

const postRouter= express.Router()

postRouter.post("/post-upload",loginValidation, upload.array("post", 10) ,postUpload)


export default postRouter