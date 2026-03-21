import { IsEmail, IsObject, IsOptional, IsString, MaxLength } from "class-validator";
import { Location } from "src/locations/entities/location.entity";

export class CreateEmployeeDto {
    @IsString()
    @MaxLength(40)
    employeeName: string;
    @IsString()
    @MaxLength(70)
    employeeLastName: string;
    @IsString()
    @MaxLength(10)
    employeePhoneNumber: string;
    @IsEmail()
    @IsString()
    employeeEmail: string;
    @IsObject()
    @IsOptional()
    location: Location;
}
