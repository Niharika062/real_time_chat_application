import Message from "../models/message.model.js";
import redis from "../config/redis.js";
import { io } from "../index.js";

// GET MESSAGES between two users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log("GET MESSAGES ERROR:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;
    const { message } = req.body;

    const newMessage = await Message.create({
      senderId,
      receiverId: userId,
      message,
    });

    // emit socket event to receiver in real time
    const receiverSocketId = await redis.get(`socket:${userId}`);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({ message: newMessage });
  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// GET ONLINE USERS
const getOnlineUsers = async (req, res) => {
  try {
    const keys = await redis.keys("online:*");
    const onlineUserIds = keys.map((key) => key.replace("online:", ""));
    return res.status(200).json({ onlineUserIds });
  } catch (error) {
    console.log("GET ONLINE USERS ERROR:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export { getMessages, sendMessage, getOnlineUsers };