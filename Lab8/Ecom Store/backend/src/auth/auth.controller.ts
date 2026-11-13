
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() user: any) {
    return this.authService.signup(user);
  }

  @Post('login')
  login(@Body() user: any) {
    return this.authService.login(user);
  }
}
