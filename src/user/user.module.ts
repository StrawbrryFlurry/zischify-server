import { Module, HttpModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [HttpModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
