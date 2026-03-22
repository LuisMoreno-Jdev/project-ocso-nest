import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
      default: 'user@example.com'
  })
  @IsEmail()
  @IsString()
  userEmail: string;
  @ApiProperty({
      default: 's0yun4c0n7r4s3n4'
  })
  @IsString()
  @MinLength(8)
  password: string;
}