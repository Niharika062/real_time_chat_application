import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./db/index.js";
import app from "./app.js";
import "./config/redis.js";
import redis from "./config/redis.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'https://real-time-chat-application-brown-tau.vercel.app'],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    await redis.set(`online:${userId}`, "true");
    await redis.set(`socket:${userId}`, socket.id);
  }

  // emit online users to everyone
  const keys = await redis.keys("online:*");
  const onlineUserIds = keys.map((key) => key.replace("online:", ""));
  io.emit("getOnlineUsers", onlineUserIds);

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    if (userId) {
      await redis.del(`online:${userId}`);
      await redis.del(`socket:${userId}`);
    }
    // emit updated online users
    const keys = await redis.keys("online:*");
    const onlineUserIds = keys.map((key) => key.replace("online:", ""));
    io.emit("getOnlineUsers", onlineUserIds);
  });
});

export { io };

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed", error);
  });