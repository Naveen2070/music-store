import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.apiKey = uuid4();
    const user = new User();
    Object.assign(user, createUserDto);
    const userData = await this.usersRepository.save(user);
    delete userData.password;
    return userData;
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

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByApiKey(apiKey: string) {
    return this.usersRepository.findOneBy({ apiKey });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('Could not find user with that ID');
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.usersRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
