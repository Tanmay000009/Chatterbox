import Chat, { IChat, IMessage } from "../../models/Chat";
import { IUser } from "../../models/User";
import { ObjectId } from "mongodb";

const GetUserChats = async (id: ObjectId) => {
  return await Chat.aggregate([
    {
      $match: {
        $or: [{ admins: id }, { members: id }],
      },
    },
    {
      $project: {
        admins: 1,
        members: 1,
        name: 1,
        createdAt: 1,
        updatedAt: 1,
        Count: {
          $size: { $ifNull: ["$messages", []] },
        },
        messages: { $slice: ["$messages", -15] },
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
  ]).exec();
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

const GetChatById = async (id: ObjectId) => {
  return (await Chat.findById(
    id,
    { messages: 0 },
    { lean: true }
  )) as unknown as IChat;
};

const GetChatByIdWithMessages = async (id: ObjectId) => {
  return await Chat.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $project: {
        admins: 1,
        members: 1,
        name: 1,
        createdAt: 1,
        updatedAt: 1,
        totalMessages: {
          $size: {
            $cond: [{ $isArray: "$messages" }, "$messages", []],
          },
        },
        messages: { $slice: ["$messages", -15] },
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
  ]).exec();
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

const SendMessage = async (chatId: string, message: IMessage) => {
  return await Chat.findByIdAndUpdate(chatId, { $push: { messages: message } });
};

const GetChatMessages = async (
  chatId: string,
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;
  const chat = await Chat.findById(chatId)
    .select("messages")
    .populate({
      path: "messages.senderId",
      select: "username",
    })
    .slice("messages", [skip, pageSize]);

  return chat ? chat.messages : [];
};

const GetChatSocketIds = async (chatId: string, userId: string = "") => {
  const chat = (await Chat.findById(chatId)
    .populate("members", "socketIds")
    .populate("admins", "socketIds")
    .select("members admins")
    .lean()) as unknown as IChat;
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
  GetChatByIdWithMessages,
};
