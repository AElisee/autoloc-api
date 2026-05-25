import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body() createUser: CreateUserDto) {
    return this.usersService.create(createUser);
  }
}
