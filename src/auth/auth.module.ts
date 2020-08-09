import { Module, HttpModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { DatabaseService } from 'src/shared/database.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, DatabaseService],
})
export class AuthModule {}
