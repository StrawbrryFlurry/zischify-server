import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { auth } from 'firebase-admin';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { IDiscordUserProfile } from 'src/models/discord/DiscordUserProfile';
import { OAuthToken } from 'src/models/discord/token';
import { UserService } from 'src/user/user.service';
import { DatabaseService } from 'src/shared/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
  ) {}

  createUser(token: OAuthToken) {
    return this.userService.getDiscordUserToken(token).pipe(
      switchMap(secret => this.userService.getDiscordUserProfile(secret)),
      switchMap(profile => this.databaseService.setDatabaseUser(profile)),
      switchMap(profile => this.generateFirebaseAuthToken(profile)),
    );
  }

  generateFirebaseAuthToken({ id }: Partial<IDiscordUserProfile>) {
    console.log(id);
    return from(auth().createCustomToken(id));
  }
}
