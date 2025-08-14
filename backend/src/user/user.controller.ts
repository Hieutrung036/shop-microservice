import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { email: string; username: string; password: string }) {
    return this.userService.createUser(body.email, body.username, body.password);
  }

  @Post('change-password')
  async changePassword(@Body() body: { email: string; oldPassword: string; newPassword: string }) {
    return this.userService.changePassword(body.email, body.oldPassword, body.newPassword);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAll(); // Hàm này trả về mảng user
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.findById(Number(id));
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return { error: 'User not found' };
    // Không trả về password
    const { password, ...userInfo } = user;
    return userInfo;
  }

  @Get('by-username/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) return { error: 'User not found' };
    const { password, ...userInfo } = user;
    return userInfo;
  }
} 