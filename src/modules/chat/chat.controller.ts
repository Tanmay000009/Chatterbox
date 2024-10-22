import { Router } from "express";
import { ChatService } from "./chat.service";
import { ChatUserController } from "./chat-user.controller";

const router = Router();

router.post("/message", ChatService.sendMessage);
router.get("/messages", ChatService.getChatMessages);
router.use("/user", ChatUserController);

export const ChatController = router;
