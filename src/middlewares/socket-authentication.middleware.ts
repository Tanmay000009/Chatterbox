import { Socket } from "socket.io";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthenticationUtil, IJWTUser } from "../utils/authentication";
import { NextFunction } from "express";

export const SocketAuthenticationMiddleware = async (
  socket: Socket,
  next: NextFunction
) => {
  const token = String(socket.handshake.query.token);

  if (!token) {
    return next(new Error("Authentication error: token is missing"));
  }

  let decodedToken: IJWTUser;

  try {
    decodedToken = AuthenticationUtil.VerifyToken(token);
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return next(new Error("Token expired"));
    }
    console.error("Error while verifying token", error);
    return next(new Error("Invalid token"));
  }

  const userId = decodedToken?.user?.id;

  if (!userId) {
    return next(new Error("Invalid token"));
  }

  const user = await AuthRepository.GetUserById(userId);

  if (!user) {
    return next(new Error("Invalid token"));
  }

  socket.user = user;

  next();
};
