import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Provider } from 'src/providers/entities/provider.entity';


export class CreateProductDto{
    @ApiProperty()
    @IsUUID("4")
    @IsOptional()
    productId: string;

    @ApiProperty()
    @IsString()
    @MaxLength(40)
    productName: string;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsInt()
    countSeal: number;
    
    @ApiProperty()
    @IsObject()
    provider: Provider;
}
