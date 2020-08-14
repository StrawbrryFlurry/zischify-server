import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { credential, initializeApp, ServiceAccount } from 'firebase-admin';
import http from 'http';
import * as firebaseConfig from '../secrets/zischify-9363a-firebase-adminsdk-yl8ea-1e83cf8eb3.json';
import { AppModule } from './app.module';
import { createClient } from './discord-bot';

initializeApp({
  credential: credential.cert(firebaseConfig as ServiceAccount),
});

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const config = app.get<ConfigService>(ConfigService);

  const version = config.get('api.version');
  const botToken = config.get('DISCORD_BOT_TOKEN');

  app.setGlobalPrefix(`api/v${version}`);

  app.init();
  createClient(botToken, app);

  http.createServer(server).listen(3000);
}

bootstrap();
