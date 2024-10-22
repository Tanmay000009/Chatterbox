import crypto from "crypto";
import { ENCRYPTION_KEY } from "../configs/config";

const IV_LENGTH = 16;

function Encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function Decrypt(text: string): string {
  const parts = text?.split(":");
  if (parts.length !== 2) return text;

  const ivPart = parts.shift();
  if (!ivPart) return text;
  const iv = Buffer.from(ivPart, "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText.toString("hex"), "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export const Security = {
  Encrypt,
  Decrypt,
};
