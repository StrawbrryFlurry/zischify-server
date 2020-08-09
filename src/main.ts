import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

import {
  credential,
  initializeApp,
  ServiceAccount,
  auth,
} from 'firebase-admin';
import * as firebaseConfig from '../secrets/zischify-9363a-firebase-adminsdk-yl8ea-1e83cf8eb3.json';

import http from 'http';
import https from 'https';
import { bot } from './discord-bot';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  bot.login(botToken);

  http.createServer(server).listen(3000);
}

bootstrap();
