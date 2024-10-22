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
import { IMessage, MessageType } from "../../models/Chat";
import { ObjectId } from "mongodb";

let io: Server;

export const setSocketIO = (socketIO: Server) => {
  io = socketIO;
};

const sendMessage = async (req: AuthRequest & Request, res: Response) => {
  const dto = req?.body;

  const errors = await ValidateDto(dto, SendMessageDto);
  if (errors && errors.length > 0) {
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

  const messageStructure: IMessage = {
    senderId: req.user?._id,
    text: dto.message,
    timestamp: new Date(),
    type: MessageType.TEXT,
    senderUsername: req.user?.username,
    chatName: chat.name,
    chatId: dto.chatId,
    messageId: new ObjectId(),
  } as IMessage;

  await ChatRepository.SendMessage(dto.chatId, messageStructure);

  io.to(chatSocketIds).emit("receiveMessage", {
    ...messageStructure,
    chatId: dto.chatId,
  });

  res.status(200).json({
    sentMessage: messageStructure,
    message: "Message sent successfully",
  });
};

const getChatMessages = async (req: AuthRequest & Request, res: Response) => {
  const query = req.query;

  const validationObject = plainToInstance(GetChatMessagesDto, query);
  const errors = await validate(validationObject as object);
  if (errors && errors.length > 0) {
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
    validationObject.page ? parseInt(validationObject.page) : 1,
    validationObject.limit ? parseInt(validationObject.limit) : 15
  );

  res.status(200).json({ messages, message: "Messages fetched successfully" });
};

export const ChatService = {
  sendMessage,
  getChatMessages,
  setSocketIO,
};
