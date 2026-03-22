import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        default: 'user@example.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    userEmail: string;
    @ApiProperty({
        default: 's0yun4c0n7r4s3n4'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
    @ApiProperty({
        default: 'Employee'
    })
    @IsOptional()
    @IsIn(['Admin','Manager','Employee'])
    userRoles: string[];
}
