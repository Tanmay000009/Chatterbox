import { IsNotEmpty, IsString } from "class-validator";

export class GetChatMessagesDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  page?: string;

  @IsString()
  limit?: string;
}
