import mongoose from "mongoose";

export const ConvertToObjectId = (id: string): mongoose.Schema.Types.ObjectId =>
  new mongoose.Schema.Types.ObjectId(id);
