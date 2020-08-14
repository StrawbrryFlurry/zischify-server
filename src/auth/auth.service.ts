import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { auth } from 'firebase-admin';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IDiscordUserProfile } from 'src/models/discord/DiscordUserProfile';
import { OAuthToken } from 'src/models/discord/token';
import { DatabaseService } from 'src/shared/database.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly dbService: DatabaseService,
  ) {}

  createUser(token: OAuthToken) {
    return this.userService.getDiscordUserToken(token).pipe(
      switchMap(secret => this.userService.getInitUserProfile(secret)),
      switchMap(profile => this.userService.setDatabaseUser(profile)),
      switchMap(profile => this.generateFirebaseAuthToken(profile)),
    );
  }

  generateFirebaseAuthToken({ id }: Partial<IDiscordUserProfile>) {
    return from(auth().createCustomToken(id));
  }
}
