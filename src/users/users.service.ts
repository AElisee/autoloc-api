import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // GET ALL
  async findAll() {
    const users = await this.userRepository.find();

    return users.map((user) => {
      // const { password, ...result } = user;
      // return result;
      return this.excludePassword(user);
    });
  }

  // GET ONE
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé !');
    }

    return this.excludePassword(user);
  }

  // POST
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('Cet mail existe déjà');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return this.excludePassword(savedUser);
  }

  // UPDATE

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur introuvable !');
    }

    Object.assign(user, updateUserDto); // fusionne anciennes et nouvelles données

    const updatedUser = await this.userRepository.save(user);

    return this.excludePassword(updatedUser);
  }

  // DELETE
  async remove(id: number) {
    const deletedUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!deletedUser) {
      throw new BadRequestException('Utilisateur inexistant !');
    }

    await this.userRepository.delete(id);

    return {
      message: 'Utilisteur supprimé !',
    };
  }

  private excludePassword(user: User) {
    const { password, ...result } = user;
    return result;
  }
}
