import { IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Provider } from 'src/providers/entities/provider.entity';


export class CreateProductDto{
    @IsUUID("4")
    @IsOptional()
    productId: string;
    @IsString()
    @MaxLength(40)
    productName: string;
    @IsNumber()
    price: number;
    @IsInt()
    countSeal: number;
    @IsString()
    @IsUUID("4")
    provider: Provider;
}
