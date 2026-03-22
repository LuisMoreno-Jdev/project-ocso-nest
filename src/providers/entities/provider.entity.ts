import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Provider {
    @ApiProperty({
        default: 'UUID'
    })
    @PrimaryGeneratedColumn('uuid')
    providerId: string;

    @Column('text')
    providerName: string;

    @Column('text',{
        unique: true,
    })
    providerEmail: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    providerPhoneNumber: string;


    @OneToMany(() => Product, (product) => product.provider)
    products: Product[];
}
