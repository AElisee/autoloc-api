import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { CarResponseDto } from './response-dto/car-response-dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,

    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  // CREATE CAR
  async create(createCarDto: CreateCarDto) {
    const company = await this.companiesRepository.findOne({
      where: {
        id: createCarDto.companyId,
      },
    });

    if (!company) {
      throw new BadRequestException('Compagnie introuvable');
    }

    const car = this.carsRepository.create({
      brand: createCarDto.brand,
      model: createCarDto.model,
      pricePerDay: createCarDto.pricePerDay,
      image: createCarDto.image,
      company,
    });

    return await this.carsRepository.save(car);
  }
  // ------------

  async findAll() {
    const cars = await this.carsRepository.find({
      relations: {
        company: true,
      },
    });

    return plainToInstance(CarResponseDto, cars, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!car) {
      throw new BadRequestException('Voiture introuvable');
    }

    return plainToInstance(CarResponseDto, car, {
      excludeExtraneousValues: true,
    });
  }
  // -----------------

  async update(id: number, updateCarDto: UpdateCarDto) {
    const updatedcar = await this.carsRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!updatedcar) {
      throw new BadRequestException('Voiture introuvable');
    }

    if (updateCarDto.companyId) {
      const company = await this.companiesRepository.findOne({
        where: {
          id: updateCarDto.companyId,
        },
      });

      if (!company) {
        throw new BadRequestException('Compagnie introuvable');
      }

      updatedcar.company = company;
    }

    Object.assign(updatedcar, {
      brand: updateCarDto.brand,
      model: updateCarDto.model,
      pricePerDay: updateCarDto.pricePerDay,
      image: updateCarDto.image,
    });

    const car = await this.carsRepository.save(updatedcar);
    return plainToInstance(CarResponseDto, car, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number) {
    const car = await this.carsRepository.findOne({
      where: { id },
    });

    if (!car) {
      throw new BadRequestException('Voiture introuvable');
    }

    await this.carsRepository.delete(id);

    return {
      message: 'Voiture supprimée',
    };
  }
}
