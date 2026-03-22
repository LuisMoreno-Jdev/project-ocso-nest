import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MaxLength } from 'class-validator';

export class CreateRegionDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty()
    @IsArray()
    regionsState: string[];
}
