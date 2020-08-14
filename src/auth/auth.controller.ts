import { Body, Controller, Post } from '@nestjs/common';
import { OAuthToken } from 'src/models/discord/token';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  createUser(@Body('token') token: OAuthToken) {
    return this.authService.createUser(token);
  }
}
