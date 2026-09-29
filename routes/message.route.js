import express from "express"
import { loginValidation } from "../middlewares/Authorization.js"
import { createNewMessage } from "../controllers/message.contoller.js"
const messageRouter= express.Router()
messageRouter.post("/create/new/message", loginValidation, createNewMessage)

export default messageRouter