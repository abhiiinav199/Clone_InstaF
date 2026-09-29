import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";

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
            members:{$all:[receiverId,senderId]}
        });

        if(!conversation){
           
             conversation = await ConversationModel.create({
                member:[receiverId,senderId]
            });
            
        }
        const newMessage=  new MessageModel({
            senderId:senderId,
            receiverId:receiverId,
            message:message,
        });

        if(newMessage){
            conversation.messages.push(newMessage)
        }
        await Promise.all([
            conversation.save(),newMessage.save()
        ])
        
        return res.status(200).json({
            error: false,
            success: true,
            message:"Message sent"
        })

  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
