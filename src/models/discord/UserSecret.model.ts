export interface IUserSecret {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: 'identify email';
  token_type: 'Bearer';
}
