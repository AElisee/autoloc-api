import { Expose } from 'class-transformer';

export class CompanyResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
