import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createNewMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;
    if (!receiverId || !message || !senderId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching data",
      });
    }

    let conversation = await ConversationModel.findOne({
      members: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        members: [receiverId, senderId],
      });
    }
    const newMessage = new MessageModel({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId= getReceiverSocketId(receiverId)

    if(receiverSocketId){
      io.to(receiverSocketId).emit("new-message",newMessage)
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "Message sent",
      data:{newMessage}
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};

//get all message
export const getAllMessages = async (req, res) => {
  try {
    const currentId = req.user.userId;

    const { chatUserId } = req.params;

    if (!currentId || !chatUserId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching id's",
      });
    }

    const receiverDetails = await UserModel.findOne({ _id: chatUserId }).select(
      "_id  userName profilePicture",
    );

    if (!receiverDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    const allConversations = await ConversationModel.findOne({
      members: { $all: [chatUserId, currentId] },
    })
      .populate("messages")
      .populate("members", "_id userName profilePicture")
      .exec();

    // return response
    return res.status(200).json({
      error: false,
      success: true,
      message: "Successfully fetched all conversations of both users",
      allCoversations: allConversations?.messages || [],
      receiverDetails: receiverDetails,
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
