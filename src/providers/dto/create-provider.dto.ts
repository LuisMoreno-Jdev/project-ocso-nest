import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProviderDto{
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    providerName: string;

    @ApiProperty()
    @IsEmail()
    @IsString()
    providerEmail: string;
    
    @ApiProperty()
    @IsString()
    @MaxLength(10)
    @IsOptional()
    providerPhoneNumber: string;
}
