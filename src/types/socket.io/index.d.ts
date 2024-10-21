import { IAuthUser } from "../../utils/authentication";

declare module "socket.io" {
  interface Socket {
    user?: IAuthUser;
  }
}
