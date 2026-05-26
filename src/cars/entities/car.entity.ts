import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Company } from '../../companies/entities/company.entity';

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
}
