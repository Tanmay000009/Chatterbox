import { ObjectId } from "mongodb";

export const ConvertToObjectId = (id: string) => new ObjectId(id);
