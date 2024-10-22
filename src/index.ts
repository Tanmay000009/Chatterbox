// src/index.ts
import cors from "cors";
import express, { Express, Request, Response } from "express";
import http from "http";
import { PORT } from "./configs/config";
import db from "./configs/database.config";
import logger from "./configs/logger.config";
import upload from "./configs/multer.config";
import createSocketServer from "./configs/socket.config";
import { AuthenticationMiddleware } from "./middlewares/authentication.middleware";
import { AuthController } from "./modules/auth/auth.controller";
import { ChatController } from "./modules/chat/chat.controller";
import { AuthRepository } from "./modules/auth/auth.repository";

const app: Express = express();
const server = http.createServer(app);
createSocketServer(server);

// Connect to MongoDB

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

process.on("uncaughtException", async (err) => {
  console.log("[UNHANDLED EXCEPTION] :/");
  console.error(err);
  await AuthRepository.DropAllSocketIds();
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("Gracefully shutting down | Dropping all socket ids");
  await AuthRepository.DropAllSocketIds();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Gracefully shutting down | Dropping all socket ids");
  await AuthRepository.DropAllSocketIds();
  process.exit(0);
});

db.on("error", (error) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

app.use("/auth", AuthController);
app.use("/chat", AuthenticationMiddleware, ChatController);
app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({ error: "No file uploaded" });
    return;
  }
  res.send({ imageUrl: `/uploads/${req.file.filename}` });
});

app.use("/uploads", express.static("uploads"));

// Default route
app.get("*", (req, res) => {
  res.send("Certified Yapper!");
});
app.post("*", (req, res) => {
  res.send("Certified Yapper!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
