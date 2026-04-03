import express from "express";
import { getMessages, sendMessage, getOnlineUsers } from "../controllers/message.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/online-users", verifyToken, getOnlineUsers);
router.get("/:userId", verifyToken, getMessages);
router.post("/send/:userId", verifyToken, sendMessage);

export default router;