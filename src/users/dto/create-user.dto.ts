import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsEmail()
  @IsNotEmpty()

  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEnum(['user', 'admin'])
  role: string;
}
