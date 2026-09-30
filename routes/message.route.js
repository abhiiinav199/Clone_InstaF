import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { createNewMessage, getAllMessages } from "../controllers/message.contoller.js"
const messageRouter= express.Router()


messageRouter.post("/create/new/message", loginValidation, createNewMessage)
messageRouter.get("/get/all/message", loginValidation, getAllMessages)

export default messageRouter