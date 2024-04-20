import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Id", socket.id)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});