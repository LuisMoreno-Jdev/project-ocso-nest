import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    userEmail: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
