import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../../decorators/user.decorator';
import { Public } from '../../guards/public.guard';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() payload: any) {
    return this.authService.signup(payload);
  }

  @Public()
  @Post('login')
  login(@Body() payload: any) {
    return this.authService.login(payload);
  }

  @Get('profile')
  profile(@User() user) {
    return user;
  }
}
