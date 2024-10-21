import http from "http";
import { Server } from "socket.io";
import { SocketAuthenticationMiddleware } from "../middlewares/socket-authentication.middleware";
import { setSocketIO } from "../modules/chat/chat.service";
import { UserRepository } from "../modules/user/user.repository";

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

  io.use(SocketAuthenticationMiddleware);

  io.on("connection", async (socket) => {
    await UserRepository.AddSocketToUser(socket.user._id, socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export default createSocketServer;
