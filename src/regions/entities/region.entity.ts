import { Location } from 'src/locations/entities/location.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Region {
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
