import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm';

import { Car } from '../../cars/entities/car.entity';
@Entity('compagnies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({
    nullable: true,
  })
  logo: string;

  @OneToMany(() => Car, (car) => car.company)
  cars: Car[];
}
