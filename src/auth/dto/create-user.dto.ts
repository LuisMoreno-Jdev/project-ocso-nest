import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    userEmail: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
    @IsOptional()
    @IsIn(['Admin','Manager','Employee'])
    userRoles: string[];
}
