import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';
import { Company } from 'src/companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Car, Company])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
