import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  // getProfile(@Req() request: Request) {
  //   return request.user; // request.user vient automatiquement de JwtStrategy.validate()
  // }
  getProfile(@CurrentUser() user) {
    return user; // request.user vient automatiquement de JwtStrategy.validate()
  }
}
