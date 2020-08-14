import { HttpModule, Module } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database.service';
import { DiscordService } from 'src/shared/discord.service';
import { UserService } from 'src/user/user.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, DatabaseService, DiscordService],
})
export class AuthModule {}
