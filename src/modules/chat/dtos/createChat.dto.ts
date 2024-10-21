import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ArrayMinSize,
  IsString,
  Length,
  IsOptional,
} from "class-validator";

export class CreateChatDto {
  @IsArray()
  @IsNotEmpty({ message: "At least one member is required", each: true })
  @ArrayMinSize(1, { message: "At least one member is required" })
  @IsMongoId({ each: true, message: "Invalid member ID" })
  members: string[];

  @IsString()
  @Length(1, 20, { message: "Name must be between 1 and 20 characters" })
  @IsOptional()
  @IsNotEmpty({ message: "Name is required" })
  name?: string;
}
