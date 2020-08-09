import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { Request } from 'express';

export type TAuthenticatedUserRequest = Request & { user: auth.DecodedIdToken };

@Injectable()
export class TokenVerificationMiddleware implements NestMiddleware {
  async use(req: Request, res: any, next: () => void) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException('Authentication required');
    }

    const [, token] = authorization.split(' ');
    const user = await auth().verifyIdToken(token, true);

    if (user) {
      req['user'] = user;
      return next();
    }

    throw new UnauthorizedException('Authentication Required');
  }
}
