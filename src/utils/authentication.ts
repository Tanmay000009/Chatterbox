// src/utils/jwt.util.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_EXPIRATION, JWT_SECRET } from "../configs/config";
import { IUser } from "../models/User";

export interface IJWTUser {
  user: IUser;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

const GenerateToken = (user: IUser) => {
  return jwt.sign({ user }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

const VerifyToken = (token: string): IJWTUser => {
  return jwt.verify(token, JWT_SECRET) as IJWTUser;
};

const StrongPasswordRegex =
  /^(?=.*([A-Z]){1,})(?=.*[!@#$&*]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,100}$/;

const HashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const AuthenticationUtil = {
  GenerateToken,
  VerifyToken,
  StrongPasswordRegex,
  HashPassword,
};
