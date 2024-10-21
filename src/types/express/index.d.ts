import { IAuthUser } from "../../utils/authentication";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
