import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../user/services/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(payload: any) {
    const user = await this.userService.findOne(payload);
    if (user) throw new UnauthorizedException('Username already exists');
    const createdUser = await this.userService.create(payload);
    return {
      username: createdUser.username,
      access_token: this.jwtService.sign({
        _id: createdUser._id,
        username: createdUser.username,
      }),
    };
  }

  async login(payload: any) {
    const user = await this.userService.findOne(payload);
    if (!user || payload.password !== user.password)
      throw new UnauthorizedException('incorrent username or password');

    return {
      access_token: this.jwtService.sign({
        _id: user._id,
        username: user.username,
      }),
    };
  }
}
