import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.io server with correct CORS
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://quick-chat-full-stack-one.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://quick-chat-full-stack-one.vercel.app"
    ],
    credentials: true
  })
);

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

// Always run server (Render needs this)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("🚀 Server is running on PORT:", PORT);
});

// Export server (for Vercel)
export default server;
