// src/index.ts
import express, { Request, Response, Express } from "express";
import http from "http";
import upload from "./configs/multer.config";
import createSocketServer from "./configs/socket.config";
import db from "./configs/database.config";
import cors from "cors";
import { AuthController } from "./modules/auth/auth.controller";
import { PORT } from "./configs/config";
import { ChatUserController } from "./modules/chat/chat-user.controller";
import { AuthenticationMiddleware } from "./middlewares/authentication.middleware";

const app: Express = express();
const server = http.createServer(app);
createSocketServer(server);

// Connect to MongoDB

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

process.on("uncaughtException", (err) => {
  console.log("[UNHANDLED EXCEPTION] :/");
  console.error(err);
  process.exit(1);
});

db.on("error", (error) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

app.use("/auth", AuthController);
app.use("/chat/user", AuthenticationMiddleware, ChatUserController);
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
