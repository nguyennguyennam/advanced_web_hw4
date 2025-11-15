import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/Model/user';
import { UserDto } from 'src/Dto/userDto';
import { hashPassword, comparePassword } from './Hashing';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // --- REGISTER ---
  async registerUser(userDTO: UserDto): Promise<boolean> {
    const existed = await this.userRepository.findOne({
      where: { email: userDTO.email },
    });

    if (existed) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hashPassword(userDTO.password);

    const newUser = this.userRepository.create({
      username: userDTO.username,
      email: userDTO.email,
      password: hashedPassword,
      role: 'user',
    });

    await this.userRepository.save(newUser);
    return true;
  }

  // --- LOGIN CHECK ---
  async findUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) return null;

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return null;

    return user; 
  }

  // --- GET USER BY EMAIL ---
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // --- CHECK EMAIL EXISTS ---
  async checkEmailExists(email: string) {
    return this.findByEmail(email);
  }

  // --- FIND USER BY ID ---
  async findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
  }
}
