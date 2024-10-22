import { ObjectId } from "mongoose";
import User, { IUser } from "../../models/User";
import { LoginDto } from "./dtos/login.dto";

const CreateUser = async (user: IUser) => {
  return await User.create(user);
};

const GetUserByUserId = async (dto: LoginDto) => {
  return dto?.email
    ? await User.findOne({ email: dto.email })
    : dto?.phone
    ? await User.findOne({ phone: dto.phone })
    : await User.findOne({ username: dto.username });
};

const GetUserByEmail = async (email: string): Promise<IUser | null> => {
  return (await User.findOne(
    { email },
    { password: 0 },
    { lean: true }
  )) as IUser | null;
};

const GetUserByPhone = async (phone: string): Promise<IUser | null> => {
  return (await User.findOne(
    { phone },
    { password: 0 },
    { lean: true }
  )) as IUser | null;
};

const GetUserByUsername = async (username: string): Promise<IUser | null> => {
  return (await User.findOne(
    { username },
    { password: 0 },
    { lean: true }
  )) as IUser | null;
};

const UpdateUserPassword = async (email: string, password: string) => {
  return await User.findOneAndUpdate({ email }, { password });
};

const GetAllUsers = async (
  userId: ObjectId | null = null
): Promise<IUser[] | null> => {
  return (await User.find(
    userId ? { _id: { $ne: userId } } : {},
    { password: 0 },
    { lean: true }
  )) as IUser[] | null;
};

const GetUserById = async (id: string): Promise<IUser | null> => {
  return (await User.findById(
    id,
    { password: 0 },
    { lean: true }
  )) as IUser | null;
};

const DropAllSocketIds = async () => {
  return await User.updateMany({}, { $set: { socketIds: [] } });
};

export const AuthRepository = {
  CreateUser,
  GetUserByEmail,
  GetUserByPhone,
  GetUserByUsername,
  UpdateUserPassword,
  GetUserByUserId,
  GetAllUsers,
  GetUserById,
  DropAllSocketIds,
};
