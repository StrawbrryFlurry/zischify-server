import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { auth } from 'firebase-admin';

export type TAuthenticatedUserRequest = Request & {
  user: auth.DecodedIdToken & { id: string };
};

@Injectable()
export class TokenVerificationMiddleware implements NestMiddleware {
  async use(req: Request, res: any, next: () => void) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException('Authentication required');
    }

    const [, token] = authorization.split(' ');
    let user: auth.DecodedIdToken;

    try {
      user = await auth().verifyIdToken(token, true);
    } catch {
      throw new UnauthorizedException('Authentication required');
    }

    if (user) {
      req['user'] = user;
      req['user']['id'] = user.uid;

      return next();
    }

    throw new UnauthorizedException('Authentication Required');
  }
}
