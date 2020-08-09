export default () => ({
  api: {
    version: '1',
  },
  url: {
    discord: {
      token: 'https://discord.com/api/oauth2/token',
      revocation: 'https://discord.com/api/oauth2/token/revoke',
      me: 'https://discord.com/api/users/@me',
      redirect: 'https://vaorra.net',
      useravatar: 'https://cdn.discordapp.com/avatars',
    },
  },
});

export const config = {
  COMMAND_PREFIX_LIST: ['zischify', 'zisch', 'z'],
  CHANNEL_ID: '740873459135021097',
  GUILD_ID: '320151654496469003',
};
