import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin:"http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

io.on("connection", (socket) => {
  console.log("Id", socket.id);
  
  socket.on("message", ({message, room}) => {
    // console.log(data);
    socket.to(room).emit("receive-message", message);
  })

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  })

  socket.on("join-room", (room) => {
    socket.join(room);
  })

})

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});