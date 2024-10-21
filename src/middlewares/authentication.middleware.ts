import { NextFunction, Request, Response } from "express";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthenticationUtil, IJWTUser } from "../utils/authentication";

export const AuthenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = String(req.headers["authorization"]);

  if (!token) {
    res.status(401).json({
      auth: false,
      message: "No token provided",
    });
    return;
  }

  let decodedToken: IJWTUser;

  try {
    decodedToken = AuthenticationUtil.VerifyToken(token);
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      res.status(401).json({
        status: false,
        message: "Token expired",
      });
      return;
    }
    console.error("Error while verifying token", error);
    res.status(401).json({
      status: false,
      message: "Invalid token",
    });
    return;
  }

  const userId = decodedToken?.user?._id;

  if (!userId) {
    res.status(401).json({
      status: false,
      message: "Invalid token",
    });
    return;
  }

  const user = await AuthRepository.GetUserById(userId.toString());

  if (!user) {
    res.status(401).json({
      status: false,
      message: "Invalid token",
    });
    return;
  }

  req.user = user;

  next();
};
