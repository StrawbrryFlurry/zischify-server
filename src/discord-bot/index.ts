import { Client, Message } from 'discord.js';
import { MessageHook } from './hooks/messagehook';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

let a;

export const createClient = (token: string, app: INestApplication) => {
  const client = new Client();

  client.on('ready', () => {
    client.user.setActivity('Zisch am chöcherle');
    console.log('[Zischify] Ready');
  });

  client.on('message', (message: Message) => MessageHook(message));

  client.login(token);
};
