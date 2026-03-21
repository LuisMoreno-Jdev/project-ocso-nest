import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class LocatonEmployeeDto {
    @ApiProperty()
    locationId: number;

    @ApiPropertyOptional()
    locationName: string;

    @ApiPropertyOptional()
    locationLatLng: number[];

    @ApiPropertyOptional()
    locationAddress: string;
}

export class CreateEmployeeDto {
    @ApiProperty()
    @IsString()
    @MaxLength(40)
    employeeName: string;
    @ApiProperty()
    @IsString()
    @MaxLength(70)
    employeeLastName: string;
    @ApiProperty()
    @IsString()
    @MaxLength(10)
    employeePhoneNumber: string;
    @ApiProperty()
    @IsEmail()
    @IsString()
    employeeEmail: string;
    @ApiProperty()
    @IsObject()
    @IsOptional()
    location: LocatonEmployeeDto;
}

