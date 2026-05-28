import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { Car } from 'src/cars/entities/car.entity';
import { BookingStatus } from '../enum/booking-status.enum';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Car, (car) => car.bookings)
  car: Car;
}
