import { Module, HttpModule } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { DatabaseService } from 'src/shared/database.service';

@Module({
  imports: [HttpModule],
  providers: [RequestService, DatabaseService],
  controllers: [RequestController],
})
export class RequestModule {}
