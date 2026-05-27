import { Expose, Type } from 'class-transformer';
import { CompanyResponseDto } from './company-response-dto';

export class CarResponseDto {
  @Expose()
  id: number;

  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  pricePerDay: number;

  @Expose()
  image?: string;

  @Expose()
  @Type(() => CompanyResponseDto)
  company: CompanyResponseDto;
}
