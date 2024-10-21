import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from "class-validator";

export class LoginDto {
  @ValidateIf((dto: LoginDto) => !dto.phone && !dto.username)
  @IsNotEmpty({ message: "Either of email, phone or username is required" })
  @IsEmail({}, { message: "Invalid email" })
  email?: string;

  @ValidateIf((dto: LoginDto) => !dto.email && !dto.username)
  @IsNotEmpty({ message: "Either of email, phone or username is required" })
  @IsString()
  @Length(10, 10, { message: "Invalid phone number" })
  phone?: string;

  @ValidateIf((dto: LoginDto) => !dto.email && !dto.phone)
  @IsNotEmpty({ message: "Either of email, phone or username is required" })
  @IsString()
  @Length(3, 20, { message: "Invalid username" })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: "Invalid password constraint" })
  password: string;
}
