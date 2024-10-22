import { Request, Response } from "express";
import { IUser } from "../../models/User";
import { ValidateDto } from "../../utils/validator";

import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { AuthRepository } from "./auth.repository";
import { AuthenticationUtil } from "../../utils/authentication";
import { UpdatePasswordDto } from "./dtos/updatePassword.dto";

const registerUser = async (req: Request, res: Response) => {
  const user: IUser = req.body;

  const errors = await ValidateDto(user, RegisterDto);
  if (errors) {
    res.status(400).json({ errors });
    return;
  }

  const userWithEmail = await AuthRepository.GetUserByEmail(user.email);

  if (userWithEmail) {
    res
      .status(400)
      .json({ message: "User with given email already exists. Please login" });

    return;
  }

  const userWithPhone = await AuthRepository.GetUserByPhone(user.phone);

  if (userWithPhone) {
    res
      .status(400)
      .json({ message: "User with given phone already exists. Please login" });

    return;
  }

  const userWithUsername = await AuthRepository.GetUserByUsername(
    user.username
  );

  if (userWithUsername) {
    res.status(400).json({
      message: "Username already taken. Please take different username.",
    });

    return;
  }

  user.password = AuthenticationUtil.HashPassword(user.password);

  const newUser = await AuthRepository.CreateUser(user);
  newUser.password = undefined;
  res.status(201).json({ newUser, message: "User created successfully" });
};

const loginUser = async (req: Request, res: Response) => {
  const loginDto: LoginDto = req.body;

  const errors = await ValidateDto(loginDto, LoginDto);
  if (errors) {
    res.status(400).json({ errors });
    return;
  }

  const user = await AuthRepository.GetUserByUserId(loginDto);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const hashedPassword = AuthenticationUtil.HashPassword(loginDto.password);

  if (hashedPassword !== user.password) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  user.password = undefined;
  const token = AuthenticationUtil.GenerateToken(user);

  res.status(200).json({ token, user, message: "User logged in successfully" });
};

const getUser = async (req: Request, res: Response) => {
  const id = req?.user?._id;

  const user = await AuthRepository.GetUserById(id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({ user, message: "User fetched successfully" });
};

const updatePassword = async (req: Request, res: Response) => {
  const updatePasswordDto: UpdatePasswordDto = req.body;

  const errors = await ValidateDto(updatePasswordDto, UpdatePasswordDto);
  if (errors) {
    res.status(400).json({ errors });
    return;
  }

  const hashedPassword = AuthenticationUtil.HashPassword(
    updatePasswordDto.password
  );

  await AuthRepository.UpdateUserPassword(req.user?.email, hashedPassword);

  res.status(200).json({ message: "Password updated successfully" });
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await AuthRepository.GetAllUsers(req.user?._id);

  res.status(200).json({ users, message: "Users fetched successfully" });
};

export const AuthService = {
  registerUser,
  loginUser,
  getUser,
  updatePassword,
  getAllUsers,
};
