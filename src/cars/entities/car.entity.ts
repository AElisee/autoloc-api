import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Company } from '../../companies/entities/company.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  pricePerDay: number;

  @Column({
    nullable: true,
  })
  image: string;

  @ManyToOne(() => Company, (company) => company.cars)
  company: Company;

  @OneToMany(() => Booking, (booking) => booking.car)
  bookings: Booking[];
}
