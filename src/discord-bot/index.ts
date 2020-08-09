import { Client, Message } from 'discord.js';
import { MessageHook } from './hooks/messagehook';

const client = new Client();

client.on('ready', () => {
  client.user.setActivity('Zisch am chöcherle');
  console.log('[Zischify] Ready');
});
client.on('message', (message: Message) => MessageHook(message));

export const bot = client;
