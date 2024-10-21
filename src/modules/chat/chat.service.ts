import { Request, Response } from "express";
import { AuthRequest } from "../../utils/authentication";
import { ValidateDto } from "../../utils/validator";
import { SendMessageDto } from "./dtos/sendMessage.dto";
import { ChatRepository } from "./chat.repository";
import { GetChatMessagesDto } from "./dtos/GetChatMessages.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ChatUtil } from "./chat.util";
import { Server } from "socket.io";

let io: Server;

export const setSocketIO = (socketIO: Server) => {
  io = socketIO;
};

const sendMessage = async (req: AuthRequest & Request, res: Response) => {
  const dto = req?.body;

  const errors = await ValidateDto(dto, SendMessageDto);
  if (errors) {
    res.status(400).json({ errors });
    return;
  }

  const chat = await ChatRepository.GetChatMembers(dto.chatId);

  if (!chat) {
    res.status(400).json({ message: "Chat not found" });
    return;
  }

  if (!ChatUtil.isUserParticipant(chat, req.user?._id)) {
    res.status(400).json({ message: "You are not a participant of this chat" });
    return;
  }

  const chatSocketIds = await ChatRepository.GetChatSocketIds(
    dto.chatId,
    req.user._id.toString()
  );

  io.to(chatSocketIds).emit("receiveMessage", {
    chatId: dto.chatId,
    message: dto.message,
    userId: req.user?._id,
    name: chat.name,
  });

  const sentMessage = await ChatRepository.SendMessage(dto.chatId, dto.message);

  res.status(200).json({ sentMessage, message: "Message sent successfully" });
};

const getChatMessages = async (req: AuthRequest & Request, res: Response) => {
  const query = req.query;

  const validationObject = plainToInstance(GetChatMessagesDto, query);
  const errors = await validate(validationObject as object);
  if (errors) {
    res.status(400).json({ errors });
    return;
  }

  const chat = await ChatRepository.GetChatMembers(validationObject.chatId);

  if (!chat) {
    res.status(400).json({ message: "Chat not found" });
    return;
  }

  if (!ChatUtil.isUserParticipant(chat, req.user?._id)) {
    res.status(400).json({ message: "You are not a participant of this chat" });
    return;
  }

  const messages = await ChatRepository.GetChatMessages(
    validationObject.chatId,
    validationObject.page,
    validationObject.limit
  );

  res.status(200).json({ messages, message: "Messages fetched successfully" });
};

export const ChatRoute = {
  sendMessage,
  getChatMessages,
  setSocketIO,
};
