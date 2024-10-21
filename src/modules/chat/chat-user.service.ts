import { Request, Response } from "express";
import { AuthRequest } from "../../utils/authentication";
import { ConvertToObjectId } from "../../utils/db";
import { ValidateDto } from "../../utils/validator";
import { ChatRepository } from "./chat.repository";
import { ChatUtil } from "./chat.util";
import { CreateChatDto } from "./dtos/createChat.dto";

const getUserChats = async (req: AuthRequest & Request, res: Response) => {
  const id = req.user?._id;

  const chats = await ChatRepository.GetUserChats(id.toString());

  res.status(200).json({ chats, message: "Chats fetched successfully" });
};

const createChat = async (req: AuthRequest & Request, res: Response) => {
  const dto: CreateChatDto = req.body;
  const userId = req.user?._id?.toString();

  const errors = await ValidateDto(dto, CreateChatDto);
  if (errors) {
    res.status(400).json({ errors });
    return;
  }

  if (dto.members.includes(userId)) {
    res.status(400).json({ message: "You cannot create a chat with yourself" });
    return;
  }

  // Dedupe logic for private chats
  if (dto.members.length === 1) {
    const chat = await ChatRepository.GetChatByMembers(dto.members);
    if (chat) {
      res.status(200).json({ chat, message: "Chat fetched successfully" });
      return;
    }
  }

  const chat = await ChatRepository.CreateChat(dto.members, [userId], dto.name);

  res.status(200).json({ chat, message: "Chat created successfully" });
};

const getChatById = async (req: AuthRequest & Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ message: "Chat ID is required" });
    return;
  }

  const chat = await ChatRepository.GetChatById(id);

  res.status(200).json({ chat, message: "Chat fetched successfully" });
};

const leaveChat = async (req: AuthRequest & Request, res: Response) => {
  const chatId = req.params.chatId;
  const userId = req.user?._id?.toString();

  if (!chatId) {
    res.status(400).json({ message: "Chat ID is required" });
    return;
  }

  const chat = await ChatRepository.GetChatById(chatId);

  if (!chat) {
    res.status(400).json({ message: "Chat not found" });
    return;
  }

  if (!ChatUtil.isUserParticipant(chat, userId)) {
    res.status(400).json({ message: "You are not a participant of this chat" });
    return;
  }

  if (ChatUtil.isUserAdmin(chat, userId) && chat.members.length === 1) {
    res.status(400).json({
      message:
        "You are the only admin of this chat. Please make another user admin before leaving.",
    });
    return;
  }

  const updatedChat = await ChatRepository.RemoveUserFromChat(chatId, userId);

  res
    .status(200)
    .json({ chat: updatedChat, message: "Chat left successfully" });
};

const makeUserAdmin = async (req: AuthRequest & Request, res: Response) => {
  const chatId = req.params.chatId;
  const userId = req.user?._id?.toString();
  const targetUserId: string = req.params.userId;

  if (!chatId || !userId || !targetUserId) {
    res.status(400).json({ message: "Chat ID and user ID are required" });
    return;
  }

  const targetUserObjectId = ConvertToObjectId(targetUserId);

  const chat = await ChatRepository.GetChatById(chatId);

  if (!chat) {
    res.status(400).json({ message: "Chat not found" });
    return;
  }

  if (!ChatUtil.isUserAdmin(chat, userId)) {
    res.status(400).json({ message: "You are not an admin of this chat" });
    return;
  }

  if (!ChatUtil.isUserParticipant(chat, targetUserObjectId)) {
    res.status(400).json({ message: "User is not a member of this chat" });
    return;
  }

  if (chat.admins.includes(targetUserObjectId)) {
    res.status(400).json({ message: "User is already an admin of this chat" });
    return;
  }

  const updatedChat = await ChatRepository.MakeUserAdmin(chatId, targetUserId);

  res
    .status(200)
    .json({ chat: updatedChat, message: "User made admin successfully" });
};

const removeUserFromChat = async (
  req: AuthRequest & Request,
  res: Response
) => {
  const chatId = req.params.chatId;
  const userId = req.user?._id?.toString();
  const targetUserId = req.params.userId;

  if (!chatId || !userId || !targetUserId) {
    res.status(400).json({ message: "Chat ID and user ID are required" });
    return;
  }

  const chat = await ChatRepository.GetChatById(chatId);

  if (!chat) {
    res.status(400).json({ message: "Chat not found" });
    return;
  }

  if (!ChatUtil.isUserAdmin(chat, userId)) {
    res.status(400).json({ message: "You are not an admin of this chat" });
    return;
  }

  if (!ChatUtil.isUserParticipant(chat, ConvertToObjectId(targetUserId))) {
    res.status(400).json({ message: "User is not a member of this chat" });
    return;
  }

  const updatedChat = await ChatRepository.RemoveUserFromChat(
    chatId,
    targetUserId
  );

  res.status(200).json({
    chat: updatedChat,
    message: "User removed from chat successfully",
  });
};

export const ChatUserService = {
  getUserChats,
  createChat,
  getChatById,
  leaveChat,
  makeUserAdmin,
  removeUserFromChat,
};
