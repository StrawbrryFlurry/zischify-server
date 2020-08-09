import { Controller, Get, Param } from '@nestjs/common';
import { IUserProfile } from 'src/models/user/UserProfile';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
