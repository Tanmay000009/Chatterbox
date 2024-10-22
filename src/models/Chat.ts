import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Security } from "../utils/encryption";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
}

export interface IMessage extends Document {
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

// Encrypt the messages
function EncryptMessages(messages) {
  console.log(messages);

  return messages.map((message) => {
    message.text = Security.Encrypt(message.text);
    return message;
  });
}

// Middleware to update the updatedAt field on save
chatSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  this.messages = EncryptMessages(this.messages);
  next();
});

chatSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  console.log(update);

  if (update["$push"]?.messages) {
    update["$push"].messages = EncryptMessages([update["$push"].messages]);
  }
  next();
});

function DecryptMessages(messages: IMessage[]) {
  return messages.map((message) => {
    message.text = Security.Decrypt(message.text);
    return message;
  });
}

chatSchema.post("findOneAndUpdate", function (doc) {
  doc.messages = DecryptMessages(doc.messages);
});

chatSchema.post("aggregate", function (docs) {
  docs.forEach((doc) => {
    doc.messages = DecryptMessages(doc.messages);
  });
});

chatSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    doc.messages = DecryptMessages(doc.messages);
  });
});

const Chat = model("Chat", chatSchema);

export default Chat;
