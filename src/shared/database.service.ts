import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDiscordUserProfile } from 'src/models/discord/DiscordUserProfile';
import { firestore as db } from 'firebase-admin';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

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
      db()
        .collection('users')
        .doc(profile.id)
        .set(
          {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            dcAccessToken: profile.access_token,
            dcRefreshToken: profile.refresh_token,
            avatar: profile.avatar,
            avatarURL: avatarURL,
            verified: profile.verified,
          },
          { merge: true },
        ),
    ).pipe(map(() => profile));
  }

  setDocument<T extends {}>(path: string, value: T, merge = true) {
    return from(
      db()
        .doc(path)
        .set(value, { merge: merge }),
    );
  }

  getDocumentData<T>(path: string): Observable<T> {
    return this.getDocument<T>(path).pipe(switchMap(snap => snap.data));
  }

  getDocument<T extends {}>(path: string): Observable<db.DocumentSnapshot<T>> {
    return from(
      db()
        .doc(path)
        .get(),
    ) as Observable<db.DocumentSnapshot<T>>;
  }
}
