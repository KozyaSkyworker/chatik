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

function getUsersInRoom(room) {
  const users = [];
  const socketsInRoom = io.sockets.adapter.rooms.get(room);

  if (socketsInRoom) {
    for (const socketId of socketsInRoom) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        users.push({
          name: socket.name,
          id: socketId,
        });
      }
    }
  }

  return users;
}

app.use(cors({ origin: "http://localhost:5173" }));

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join", ({ name, room }) => {
    console.log("new join", name, room);

    socket.name = name;
    socket.room = room;

    socket.join(room);

    io.to(room).emit("userStatus", {
      message: "joined",
      name,
      room,
    });

    const usersInRoom = getUsersInRoom(room);
    io.to(room).emit("updateUserList", usersInRoom);
  });

  socket.on("message", (recievedData) => {
    console.log(recievedData);
    io.to(recievedData.room).emit("message", { ...recievedData });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    const name = socket.name;
    const room = socket.room;

    if (room) {
      io.to(room).emit("userStatus", {
        message: "disconnected",
        name,
        room,
      });

      setTimeout(() => {
        const usersInRoom = getUsersInRoom(room);
        io.to(room).emit("updateUserList", usersInRoom);
      }, 100);
    }
  });
});

server.listen(4444, () => {
  console.log("server running at http://localhost:4444");
});
