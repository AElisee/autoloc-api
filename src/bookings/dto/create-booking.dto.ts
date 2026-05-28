import { IsDateString, IsInt } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  carId: number;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}
