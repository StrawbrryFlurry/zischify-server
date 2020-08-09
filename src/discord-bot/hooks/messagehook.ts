import { Message } from 'discord.js';
import { config } from '../../config/configuration';
import { requestZisch } from '../commands/request-zisch';

export const MessageHook = (message: Message) => {
  if (message.guild.id != config.GUILD_ID) {
    return;
  }

  if (message.channel.id != config.CHANNEL_ID) {
    return;
  }

  if (
    !config.COMMAND_PREFIX_LIST.some(prefix => message.content.includes(prefix))
  ) {
    return;
  }

  const [preifx, command, args] = message.content.split(' ');

  switch (command) {
    case 'request': {
      requestZisch(message, args);
      break;
    }

    case 'r': {
      requestZisch(message, args);
      break;
    }
  }
};
