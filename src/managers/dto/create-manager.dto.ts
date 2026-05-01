import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { Location } from "src/locations/entities/location.entity";

export class CreateManagerDto {
    @ApiProperty()
    @IsString()
    @MaxLength(80)
    managerFullName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    managerEmail: string;

    @ApiProperty()
    @IsNumber()
    managerSalary: number;

    @ApiProperty()
    @IsString()
    @MaxLength(16)
    managerPhoneNumber: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    location: Location;
}
