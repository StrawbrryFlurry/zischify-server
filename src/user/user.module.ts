import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenVerificationMiddleware } from 'src/middleware/token-verification.middleware';
import { DatabaseService } from 'src/shared/database.service';
import { DiscordService } from 'src/shared/discord.service';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule],
  providers: [UserService, DatabaseService, ConfigService, DiscordService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenVerificationMiddleware).forRoutes(UserController);
  }
}
