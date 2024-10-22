import { ObjectId } from "mongodb";
import { IChat } from "../../models/Chat";

const isUserAdmin = (chat: IChat, userId: ObjectId) => {
  return chat.admins.some((admin) => admin.toString() === userId.toString());
};

const isUserMember = (chat: IChat, userId: ObjectId) => {
  return chat.members.some((member) => member.toString() === userId.toString());
};

const isUserParticipant = (chat: IChat, userId: ObjectId) => {
  const isMember = isUserMember(chat, userId);
  const isAdmin = isUserAdmin(chat, userId);
  return isMember || isAdmin;
};

export const ChatUtil = {
  isUserAdmin,
  isUserMember,
  isUserParticipant,
};
