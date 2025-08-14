import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(email: string, username: string, password: string, role: UserRole = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, username, password: hashedPassword, role });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email }, relations: ['addresses'] });
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username }, relations: ['addresses'] });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['addresses'] });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async changePassword(email: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const user = await this.findByEmail(email);
    if (!user) return { success: false, message: 'User not found' };
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return { success: false, message: 'Mật khẩu cũ không đúng' };
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { success: true, message: 'Đổi mật khẩu thành công' };
  }
} 