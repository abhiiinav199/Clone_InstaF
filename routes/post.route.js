import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { deletePost, editPost, homePage, postUpload } from "../controllers/post.controller.js"
import { upload } from "../middlewares/multer.js"

const postRouter = express.Router()

postRouter.post("/post-upload", loginValidation, upload.array("post", 10), postUpload)
postRouter.post("/edit-post", loginValidation, editPost)
postRouter.delete("/delte-post/:postId", loginValidation, deletePost)
postRouter.get("/home", loginValidation, homePage);


export default postRouter