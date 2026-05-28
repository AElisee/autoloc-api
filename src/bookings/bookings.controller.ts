import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body()
    createBookingDto: CreateBookingDto,

    @CurrentUser() user, // recupère l'utilisateur connecté
  ) {
    return this.bookingsService.create(createBookingDto, user.userId);
  }

  // L'utilisateur vois uniquement ses propore réservations
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user) {
    return this.bookingsService.findAll(user);
  }
  //------------

  @Get('company/:id')
  findCompanyBookings(
    @Param('id', ParseIntPipe)
    companyId: number,
  ) {
    return this.bookingsService.findCompanyBookings(companyId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }

  @Patch(':id/confirm')
  confirmBooking(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.bookingsService.confirmBooking(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancelBooking(
    @Param('id', ParseIntPipe)
    id: number,

    @CurrentUser() user,
  ) {
    return this.bookingsService.cancelBooking(id, user);
  }
}
