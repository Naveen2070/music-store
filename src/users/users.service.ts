import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(CreateUser: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    CreateUser.password = await bcrypt.hash(CreateUser.password, salt);
    const user = await this.usersRepository.save(CreateUser);
    delete user.password;
    return user;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: data.email,
    });

    if (!user) {
      throw new UnauthorizedException('Could not find user with that email');
    }
    return user;
  }

  update(id: number, updateUser: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
