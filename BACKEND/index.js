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
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    redis.set(`online:${userId}`, "true");
    redis.set(`socket:${userId}`, socket.id);
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId) {
      redis.del(`online:${userId}`);
      redis.del(`socket:${userId}`);
    }
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