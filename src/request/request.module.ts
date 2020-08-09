import { Module, HttpModule } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';

@Module({
  imports: [HttpModule],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
