import { HttpService, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IUserSecret } from 'src/models/discord/UserSecret.model';
import { IUserProfile } from 'src/models/user/UserProfile';

import { DatabaseService } from './database.service';

@Injectable()
export class DiscordService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly dbService: DatabaseService,
  ) {}

  get<T extends {}>(url: string, user: Partial<IUserProfile>): Observable<T> {
    return this.http
      .get<T>(url, {
        headers: {
          authorization: `Bearer ${user.dcAccessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        switchMap(res => {
          if (res.status === 401) {
            return this.refreshAccessToken(user).pipe(
              switchMap(token => this.get<T>(url, { dcAccessToken: token })),
            );
          }

          return of(res.data);
        }),
      );
  }

  post<T extends {}>(
    url: string,
    data: {},
    user: Partial<IUserProfile>,
  ): Observable<T> {
    return this.http
      .post<T>(url, qs.stringify(data), {
        headers: {
          authorization: `Bearer ${user.dcAccessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        switchMap(res => {
          if (res.status === 401) {
            return this.refreshAccessToken(user).pipe(
              switchMap(token =>
                this.post<T>(url, data, { dcAccessToken: token }),
              ),
            );
          }
          return of(res.data);
        }),
      );
  }

  refreshAccessToken({ dcRefreshToken, id }: Partial<IUserProfile>) {
    const tokenURL = this.config.get('url.discord.token');
    const clientSecret = this.config.get('DISCORD_APP_SECRET');
    const redirectURL = this.config.get('url.discord.redirect');
    const clientID = this.config.get('config.discord.clientid');

    return this.http
      .post<IUserSecret>(
        tokenURL,
        qs.stringify({
          client_id: clientID,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: dcRefreshToken,
          redirect_uri: redirectURL,
          scope: 'identify email',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(
        map(res => res.data),
        switchMap(res => {
          if (!res.access_token)
            throw new InternalServerErrorException(
              `Failed to refresh access token for ${id}`,
            );
          return this.dbService
            .setDocument<IUserProfile>(`users/${id}`, {
              dcAccessToken: res.access_token,
              dcRefreshToken: res.refresh_token,
            })
            .pipe(map(_ => res.access_token));
        }),
      );
  }

  // Duplicate of UserService - getUserFromDB to avoid Circular Dependency
  getAccessTokenFromDB({ id }: Partial<IUserProfile>) {
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
