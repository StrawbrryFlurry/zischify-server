import { IUserSecret } from './UserSecret.model';

export interface IDiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  email: string;
  verified: boolean;
  locale: string;
  mfa_enabled: boolean;
}

export type IDiscordUserProfile = IDiscordUser & IUserSecret;
