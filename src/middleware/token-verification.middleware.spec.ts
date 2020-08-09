import { TokenVerificationMiddleware } from './token-verification.middleware';

describe('TokenVerificationMiddleware', () => {
  it('should be defined', () => {
    expect(new TokenVerificationMiddleware()).toBeDefined();
  });
});
