import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const existingCompany = await this.companiesRepository.findOne({
      where: {
        email: createCompanyDto.email,
      },
    });

    if (existingCompany) {
      throw new BadRequestException('Email déjà utilisé');
    }

    const company = this.companiesRepository.create(createCompanyDto);

    return await this.companiesRepository.save(company);
  }

  async findAll() {
    return await this.companiesRepository.find();
  }

  async findOne(id: number) {
    return await this.companiesRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('Compagnie introuvable');
    }

    Object.assign(company, updateCompanyDto);

    return await this.companiesRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('Compagnie introuvable');
    }

    await this.companiesRepository.delete(id);

    return {
      message: 'Compagnie supprimée',
    };
  }
}
