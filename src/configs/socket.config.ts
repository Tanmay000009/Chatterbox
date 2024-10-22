import http from "http";
import { Server } from "socket.io";
import { SocketAuthenticationMiddleware } from "../middlewares/socket-authentication.middleware";
import { setSocketIO } from "../modules/chat/chat.service";
import { UserRepository } from "../modules/user/user.repository";
import { setSocketIOCU } from "../modules/chat/chat-user.service";

const createSocketServer = (
  httpServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >
) => {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  setSocketIO(io);
  setSocketIOCU(io);

  console.log("Socket server created");

  io.use(SocketAuthenticationMiddleware);

  io.on("connection", async (socket) => {
    console.log("Socket connected", socket.id);
    await UserRepository.AddSocketToUser(socket.user._id, socket.id);

    console.log("User connected", socket.user.username);

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.user.username);
      UserRepository.RemoveSocketFromUser(socket.user._id, socket.id);
    });
  });

  return io;
};

export default createSocketServer;
