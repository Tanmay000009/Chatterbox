import Chat, { IChat } from "../../models/Chat";
import { IUser } from "../../models/User";

const GetUserChats = async (id: string) => {
  return await Chat.find(
    { members: { $in: [id] } },
    {
      messages: 0,
    },
    { lean: true }
  );
};

const CreateChat = async (
  members: string[],
  admins: string[],
  name?: string
) => {
  return await Chat.create({ members, admins, name });
};

const GetChatMembers = async (id: string) => {
  return (await Chat.findById(
    id,
    {
      messages: 0,
    },
    { lean: true }
  )) as unknown as IChat;
};

const GetChatById = async (id: string) => {
  return (await Chat.findById(
    id,
    {
      messages: 0,
    },
    { lean: true }
  )) as unknown as IChat;
};

const UpdateChat = async (id: string, members: string[]) => {
  return await Chat.findByIdAndUpdate(id, { members });
};

const RemoveUserFromChat = async (id: string, userId: string) => {
  return await Chat.findByIdAndUpdate(id, { $pull: { members: userId } });
};

const MakeUserAdmin = async (id: string, userId: string) => {
  return await Chat.findByIdAndUpdate(id, {
    $push: { admins: userId },
    $pull: { members: userId },
  });
};

const SendMessage = async (chatId: string, message: string) => {
  return await Chat.findByIdAndUpdate(chatId, { $push: { messages: message } });
};

const GetChatMessages = async (chatId: string, page: number, limit: number) => {
  return await Chat.findById(
    chatId,
    { messages: 1 },
    { lean: true, skip: page * limit, limit }
  );
};

const GetChatSocketIds = async (chatId: string, userId: string = "") => {
  const chat = await Chat.findById(chatId)
    .populate("members", "socketIds")
    .populate("admins", "socketIds")
    .select("members admins")
    .lean();
  const members = chat?.members?.concat(chat?.admins) as unknown as IUser[];
  console.log(userId, members);

  return members
    ?.map((member) =>
      member._id.toString() !== userId ? member.socketIds : []
    )
    .flat()
    .filter(Boolean);
};

const GetChatByMembers = async (members: string[]) => {
  return await Chat.findOne({ members: { $all: members } });
};

export const ChatRepository = {
  GetUserChats,
  CreateChat,
  GetChatById,
  GetChatMembers,
  UpdateChat,
  RemoveUserFromChat,
  MakeUserAdmin,
  SendMessage,
  GetChatMessages,
  GetChatSocketIds,
  GetChatByMembers,
};
