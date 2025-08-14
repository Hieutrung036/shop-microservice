import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    // Tìm user theo email trước
    let user = await this.userService.findByEmail(identifier);
    // Nếu không có, thử tìm theo username
    if (!user) {
      user = await this.userService.findByUsername(identifier);
    }
    if (user && await bcrypt.compare(password, user.password)) {
      // Trả về đúng username của user vừa tìm được
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username, // Đúng username của user vừa đăng nhập
      email: user.email, // Thêm dòng này!
      role: user.role, // Thêm dòng này!
    };
  }

  async register(email: string, username: string, password: string) {
    return this.userService.createUser(email, username, password);
  }
} 