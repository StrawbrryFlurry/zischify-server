import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firestore as db, auth } from 'firebase-admin';
import qs from 'qs';
import { map, filter, skipWhile, switchMap } from 'rxjs/operators';
import { IDiscordUserProfile } from 'src/models/discord/DiscordUserProfile';
import { OAuthToken } from 'src/models/discord/token';
import { IUserSecret } from 'src/models/discord/UserSecret.model';
import { IUserProfile } from 'src/models/user/UserProfile';
import { from, empty, of } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  getDiscordUserToken(token: OAuthToken) {
    const clientSecret = this.config.get('DISCORD_APP_SECRET');
    const redirectURL = this.config.get('url.discord.redirect');

    return this.http
      .post<IUserSecret>(
        this.config.get('url.discord.token'),
        qs.stringify({
          client_id: '740854356592820254',
          client_secret: clientSecret,
          code: token,
          redirect_uri: redirectURL,
          scope: 'identify email',
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      )
      .pipe(map(res => res.data));
  }

  getDiscordUserProfile(secrets: IUserSecret) {
    const { access_token } = secrets;

    return this.http
      .get<IDiscordUserProfile>(this.config.get('url.discord.me'), {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map(res => res.data),
        map(
          res =>
            ({
              ...res,
              ...secrets,
            } as IDiscordUserProfile),
        ),
      );
  }
}
