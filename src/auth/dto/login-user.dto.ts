import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsString()
  userEmail: string;
  @IsString()
  @MinLength(8)
  password: string;
}