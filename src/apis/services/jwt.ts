import { sign, SignOptions } from 'jsonwebtoken';
import { UsersModel } from '../../db/models';
import { ErrorApi } from '../error';

type TokenType = 'access' | 'refresh';
type AccessToken = { accessToken: string };
type RefreshToken = { refreshToken: string };
export type AccessAndRefreshToken = { accessToken: string; refreshToken: string };
type TokenResponse = AccessToken | RefreshToken | AccessAndRefreshToken;

export class JWTService {
  public static readonly ACCESS_TOKEN_EXPIRATION_TIME = 1 * 24 * 60 * 60; // 1 day in seconds
  public static readonly REFRESH_TOKEN_EXPIRATION_TIME = 3 * 24 * 60 * 60; // 3 days in seconds

  private static get accessSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) throw new ErrorApi(500, 'Access secret not found.');

    return secret;
  }

  private static get refreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) throw new ErrorApi(500, 'Refresh secret not found.');

    return secret;
  }

  private static signToken(payload: object, secret: string, expiresIn: SignOptions['expiresIn']): string {
    try {
      return sign(payload, secret, { expiresIn });
    } catch {
      throw new ErrorApi(500, 'Error signing token');
    }
  }
  
  public static generateTokens(user: UsersModel): AccessAndRefreshToken;
  public static generateTokens(user: UsersModel, type: 'access'): AccessToken;
  public static generateTokens(user: UsersModel, type: 'refresh'): RefreshToken;
  public static generateTokens(user: UsersModel, type?: TokenType): TokenResponse {
    const payload = { id: user.id, email: user.email };

    try {
      switch (type) {
        case 'access':
          return { accessToken: this.signToken(payload, this.accessSecret, this.ACCESS_TOKEN_EXPIRATION_TIME) };
        case 'refresh':
          return { refreshToken: this.signToken(payload, this.refreshSecret, this.REFRESH_TOKEN_EXPIRATION_TIME) };
        default:
          return {
            accessToken: this.signToken(payload, this.accessSecret, this.ACCESS_TOKEN_EXPIRATION_TIME),
            refreshToken: this.signToken(payload, this.refreshSecret, this.REFRESH_TOKEN_EXPIRATION_TIME),
          };
      }
    } catch {
      throw new ErrorApi(500, 'Error generating tokens.');
    }
  }
}
