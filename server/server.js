import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

app.use(cors({ origin: "http://localhost:5173" }));

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join", ({ name, room }) => {
    console.log("new join", name, room);
    socket.join(room);
  });

  socket.on("message", (recievedData) => {
    console.log(recievedData);
    io.to(recievedData.room).emit("message", { ...recievedData });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(4444, () => {
  console.log("server running at http://localhost:4444");
});
