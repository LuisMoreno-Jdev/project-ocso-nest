import { IsArray, IsString, MaxLength } from 'class-validator';

export class CreateRegionDto {
    @IsString()
    @MaxLength(100)
    name: string;
    @IsArray()
    regionsState: string[];
}
