import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Chat server is running!");
});

export default app;