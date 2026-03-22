import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsObject, IsOptional, IsString, MaxLength, } from "class-validator";
import { Region } from "src/regions/entities/region.entity";

export class CreateLocationDto {
    @ApiProperty()
    @IsString()
    @MaxLength(35)
    locationName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(160)
    locationAddress: string;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    locationLatLng: number[];

    @ApiProperty()
    @IsObject()
    @IsOptional()
    region: Region;
}
