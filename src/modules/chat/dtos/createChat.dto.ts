import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ArrayMinSize,
  IsString,
  Length,
  ValidateIf,
} from "class-validator";

export class CreateChatDto {
  @IsArray()
  @IsNotEmpty({ message: "At least one member is required", each: true })
  @ArrayMinSize(1, { message: "At least one member is required" })
  @IsMongoId({ each: true, message: "Invalid member ID" })
  members: string[];

  @ValidateIf((object: CreateChatDto) => object.members.length > 1)
  @IsString({ message: "Name is required for group chats" })
  @Length(1, 20, { message: "Name must be between 1 and 20 characters" })
  @IsNotEmpty({ message: "Name is required for group chats" })
  name?: string;
}
