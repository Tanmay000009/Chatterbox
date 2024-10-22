import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
}

export interface IMessage {
  senderId: ObjectId;
  senderUsername: string;
  text: string;
  timestamp: Date;
  type: MessageType;
  chatName: string;
  chatId: ObjectId;
  messageId: ObjectId;
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
  chatName: { type: String, required: true },
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  messageId: { type: Schema.Types.ObjectId, required: true },
  senderUsername: { type: String, required: true },
});

const chatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  admins: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
});

chatSchema.plugin(aggregatePaginate);

// Middleware to update the updatedAt field on save
chatSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Chat = model("Chat", chatSchema);

export default Chat;
