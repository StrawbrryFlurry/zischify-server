import { Controller, Get, Post, Req } from '@nestjs/common';
import { switchMap } from 'rxjs/operators';
import { TAuthenticatedUserRequest } from 'src/middleware/token-verification.middleware';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('refresh')
  refreshUserData(@Req() { user: { id } }: TAuthenticatedUserRequest) {
    return this.userService
      .getUserFromDB({ id })
      .pipe(switchMap(user => this.userService.refreshDiscordUserData(user)));
  }

  @Get('mock')
  getMockData() {
    return {
      Hey: 'DU Spast',
      I: {
        hate: 'My life',
      },
    };
  }
}
