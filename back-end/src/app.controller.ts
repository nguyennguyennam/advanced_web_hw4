import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ConflictException,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './Services/Query/user';
import { UserDto, LoginDto, CheckEmailDto } from './Dto/userDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: UserDto) {
    const ok = await this.userService.registerUser(dto);
    if (!ok) throw new ConflictException('Email already registered');
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const valid = await this.userService.findUser(dto.email, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');
    return { message: 'Login successful' };
  }

  @Get('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Query('email') email: string) {
    const exists = await this.userService.checkEmailExists(email);
    return { exists };
  }

  // ⭐ NEW: GET /user/me – dùng cho FE Dashboard
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = (req.user as any).userId;
    const user = await this.userService.findById(userId); // cần method này trong UserService

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
