import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.production.env',
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    RequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
