import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async findByEmail(email: string): Promise<User | null> {
    const user= await this.userRepository.findOne({ where: { email } });
    return user;
  }


  async create(createUserDto: Partial<CreateUserDto>): Promise<User> {
    let hashedPassword = null;

    if (createUserDto.password) { 
        hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword, 
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
 
}
