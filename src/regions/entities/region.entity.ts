import { ApiProperty } from '@nestjs/swagger';
import { Location } from 'src/locations/entities/location.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Region {
    @ApiProperty({
        default: '1'
    })
    @PrimaryGeneratedColumn('increment')
    regionId: number;
    @Column({
        type: 'text',
        unique: true,
    })
    name: string;
    @Column({
        type: 'text',
        array: true,
    })
    regionsState: string[];

    @OneToMany(() => Location, (location) => location.region)
    locations: Location[];
}
