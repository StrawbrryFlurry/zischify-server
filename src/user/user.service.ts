import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  IDiscordUser,
  IDiscordUserProfile,
} from 'src/models/discord/DiscordUserProfile';
import { OAuthToken } from 'src/models/discord/token';
import { IUserSecret } from 'src/models/discord/UserSecret.model';
import { IUserProfile } from 'src/models/user/UserProfile';
import { DatabaseService } from 'src/shared/database.service';
import { DiscordService } from 'src/shared/discord.service';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly dbService: DatabaseService,
    private readonly disordService: DiscordService,
  ) {}

  getDiscordUserToken(token: OAuthToken) {
    const clientSecret = this.config.get('DISCORD_APP_SECRET');
    const redirectURL = this.config.get('url.discord.redirect');
    const clientID = this.config.get('config.discord.clientid');

    return this.http
      .post<IUserSecret>(
        this.config.get('url.discord.token'),
        qs.stringify({
          client_id: clientID,
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

  getInitUserProfile(secrets: IUserSecret) {
    const url = this.config.get('url.discord.me');

    return this.disordService
      .get<IDiscordUser>(url, {
        dcAccessToken: secrets.access_token,
        dcRefreshToken: secrets.refresh_token,
      })
      .pipe(
        map(
          res =>
            ({
              ...res,
              ...secrets,
            } as IDiscordUserProfile),
        ),
      );
  }

  getDiscordUserProfile(user: IUserProfile) {
    const url = this.config.get('url.discord.me');

    return this.disordService.get<IDiscordUser>(url, user);
  }

  refreshDiscordUserData(user: IUserProfile): Observable<IUserProfile> {
    return this.getDiscordUserProfile(user).pipe(
      switchMap(discordUser => {
        const userData: Partial<IUserProfile> = {
          avatar: discordUser.avatar,
          avatarURL: this.getUserAvatarURL(discordUser),
          username: discordUser.username,
          email: discordUser.email,
        };

        return this.dbService
          .setDocument(`users/${user.id}`, userData)
          .pipe(map(_ => ({ ...user, ...userData })));
      }),
    );
  }

  getUserAvatarURL({ id, avatar }: Partial<IDiscordUserProfile>) {
    const avatarURL = this.config.get('url.discord.useravatar');
    let fileType = 'webp';

    if (avatar.startsWith('a_')) {
      fileType = 'gif';
    }

    return `${avatarURL}/${id}/${avatar}.${fileType}?size=4096`;
  }

  setDatabaseUser(profile: IDiscordUserProfile) {
    const avatarURL = this.getUserAvatarURL(profile);

    return from(
      this.dbService.setDocument(`users/${profile.id}`, {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        dcAccessToken: profile.access_token,
        dcRefreshToken: profile.refresh_token,
        avatar: profile.avatar,
        avatarURL: avatarURL,
        verified: profile.verified,
      }),
    ).pipe(map(() => profile));
  }

  getUserFromDB({ id }: Partial<IUserProfile>) {
    return this.dbService.getDocumentData<IUserProfile>(`users/${id}`).pipe(
      map(doc => {
        if (!doc)
          throw new InternalServerErrorException(
            `Failed to get document data for ${id}`,
          );

        return doc;
      }),
    );
  }
}
