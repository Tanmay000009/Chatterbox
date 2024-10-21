import { ObjectId } from "mongoose";
import { IChat } from "../../models/Chat";

const isUserAdmin = (chat: IChat, userId: ObjectId) => {
  return chat.admins.includes(userId);
};

const isUserMember = (chat: IChat, userId: ObjectId) => {
  return chat.members.includes(userId);
};

const isUserParticipant = (chat: IChat, userId: ObjectId) => {
  return isUserMember(chat, userId) || isUserAdmin(chat, userId);
};

export const ChatUtil = {
  isUserAdmin,
  isUserMember,
  isUserParticipant,
};
