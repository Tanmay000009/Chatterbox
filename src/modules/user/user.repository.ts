import User from "../../models/User";

const AddSocketToUser = async (userId: string, socketId: string) => {
  await User.findByIdAndUpdate(userId, { $push: { socketIds: socketId } });
};

const RemoveSocketFromUser = async (userId: string, socketId: string) => {
  await User.findByIdAndUpdate(userId, { $pull: { socketIds: socketId } });
};

export const UserRepository = {
  AddSocketToUser,
  RemoveSocketFromUser,
};
