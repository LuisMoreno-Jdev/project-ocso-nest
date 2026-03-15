import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Manager {
    @PrimaryGeneratedColumn('uuid')
    managerId: string;
    @Column('text')
    managerFullName: string;
    @Column('text')
    managerEmail: string;
    @Column('float')
    managerSalary: number;
    @Column('text')
    managerPhoneNumber: string;
}
