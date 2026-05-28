import { CurrentUser } from './../auth/decorators/current-user.decorator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';
import { Company } from 'src/companies/entities/company.entity';
import { BookingStatus } from './enum/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,

    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  // CREATE BOOKINK ___________
  async create(createBookingDto: CreateBookingDto, userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur introuvable');
    }

    const car = await this.carsRepository.findOne({
      where: {
        id: createBookingDto.carId,
      },
    });

    if (!car) {
      throw new Error('Voiture introuvable');
    }

    // verifie que la voiture n'est pas commandée à la même date
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        car: {
          id: car.id,
        },
      },
      relations: {
        car: true,
      },
    });

    if (existingBooking) {
      const newStart = new Date(createBookingDto.startDate);

      const newEnd = new Date(createBookingDto.endDate);

      const existingStart = new Date(existingBooking.startDate);

      const existingEnd = new Date(existingBooking.endDate);

      const hasConflict = newStart <= existingEnd && newEnd >= existingStart;

      if (hasConflict) {
        throw new BadRequestException(
          'Voiture déjà réservée sur cette période',
        );
      }
    }
    // ------------

    const booking = this.bookingsRepository.create({
      startDate: createBookingDto.startDate,

      endDate: createBookingDto.endDate,

      user,
      car,
    });

    return await this.bookingsRepository.save(booking);
  }
  // ______________

  async findAll(currentUser: any) {
    if (currentUser.role === 'admin') {
      return await this.bookingsRepository.find({
        relations: {
          user: true,
          car: true,
        },
      });
    }

    return await this.bookingsRepository.find({
      where: {
        user: {
          id: currentUser.userId,
        },
      },

      relations: {
        user: true,
        car: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.bookingsRepository.findOne({
      where: { id },

      relations: {
        user: true,
        car: true,
      },
    });
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }

  // confirmer une réservation
  async confirmBooking(id: number) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new Error('Réservation introuvable');
    }

    booking.status = BookingStatus.CONFIRMED;

    return await this.bookingsRepository.save(booking);
  }

  // Annuler une réservation
  async cancelBooking(id: number, currentUser: any) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },

      relations: {
        user: true,
      },
    });

    if (!booking) {
      throw new Error('Réservation introuvable');
    }

    const isOwner = booking.user.id === currentUser.userId;

    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new BadRequestException('Action non autorisée');
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Impossible d’annuler une réservation confirmée',
      );
    }

    booking.status = BookingStatus.CANCELLED;

    return await this.bookingsRepository.save(booking);
  }

  // les réservations pour chaque compagnie
  async findCompanyBookings(companyId: number) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Compagnie introuvable');
    }

    return await this.bookingsRepository.find({
      where: {
        car: {
          company: {
            id: companyId,
          },
        },
      },

      relations: {
        user: true,
        car: {
          company: true,
        },
      },
    });
  }
  //-------------
}
