import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from "class-validator";
import { AuthenticationUtil } from "../../../utils/authentication";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, {
    message: "Username must be between 3 and 20 characters",
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20, {
    message: "Password must be between 8 and 20 characters",
  })
  @Matches(AuthenticationUtil.StrongPasswordRegex, {
    message:
      "Password must contain at length 8 characters containig 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: "Phone number must be 10 digits",
  })
  phone: string;
}
