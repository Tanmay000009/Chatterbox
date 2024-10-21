import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetChatMessagesDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @Transform(({ value }) => parseInt(value || "0"))
  @IsNumber()
  page?: number;

  @Transform(({ value }) => parseInt(value || "10"))
  @IsNumber()
  limit?: number;
}
