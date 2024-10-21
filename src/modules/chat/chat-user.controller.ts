import { Router } from "express";
import { ChatUserService } from "./chat-user.service";

const router = Router();

router.get("/", ChatUserService.getUserChats);
router.post("/", ChatUserService.createChat);
router.get("/:id", ChatUserService.getChatById);

export const ChatUserController = router;
