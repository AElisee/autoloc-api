import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  findAll() {
    return ['user1', 'user2', 'user3'];
  }

  create(createUserDto: CreateUserDto) {
    return {
      message: 'utilsateur créé',
      data: createUserDto,
    };
  }
}
