export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  dcAccessToken: string;
  dcRefreshToken: string;
  avatar: string;
  avatarURL: string;
  verified: Boolean;
}
