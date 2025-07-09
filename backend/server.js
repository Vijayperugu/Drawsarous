import express from "express";
import http from "http";
import cors from "cors";
import connectDb from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import { Server } from "socket.io";
import RoomModal from "./model/RoomModal.js";
import roomRoute from "./routes/roomRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("UserConnected", userId);
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("join-room", async ({ roomCode, username }) => {
    socket.join(roomCode);
    io.to(roomCode).emit("player-joined", { username });
  });
 socket.on("clear-canvas", ({ roomCode }) => {
  socket.to(roomCode).emit("clear-canvas");
});

  socket.on("send-drawing", ({ roomCode, drawing }) => {
    socket.to(roomCode).emit("receive-drawing", drawing);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(cors());
app.use(express.json());
connectDb();

app.get("/", (req, res) => {
  res.send("Drawsarous Project");
});
app.use("/api/user", roomRoute);
app.use("/user", userRouter);

server.listen(8000, () => {
  console.log("Server is running");
});
