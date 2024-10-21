import { ObjectId, Schema, model } from "mongoose";

enum MessageType {
  TEXT = "text",
  IMAGE = "image",
}

export interface IMessage {
  senderId: ObjectId;
  text: string;
  timestamp: Date;
  type: MessageType;
}

export interface IChat {
  members: ObjectId[];
  admins: ObjectId[];
  messages: IMessage[];
  name: string;
}

const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: MessageType, default: MessageType.TEXT },
});

const chatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  admins: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
});

// Middleware to update the updatedAt field on save
chatSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Chat = model("Chat", chatSchema);

export default Chat;
