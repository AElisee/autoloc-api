import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  pricePerDay: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  companyId: number;
}
