import { sign, SignOptions } from 'jsonwebtoken';
import { UsersModel } from '../../db/models';
import { ErrorApi } from '../error';

type TokenType = 'access' | 'refresh';
type TokenResponse = { accessToken: string; refreshToken: string } | { accessToken: string } | { refreshToken: string };

export class JWTService {
  private static readonly accessTokenExpirationTime = '1d';
  private static readonly refreshTokenExpirationTime = '3d';

  private static get accessSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) throw new ErrorApi(500, 'Access secret not found');

    return secret;
  }

  private static get refreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) throw new ErrorApi(500, 'Refresh secret not found');

    return secret;
  }

  private static signToken(payload: object, secret: string, expiresIn: SignOptions['expiresIn']): string {
    try {
      return sign(payload, secret, { expiresIn });
    } catch {
      throw new ErrorApi(500, 'Error signing token');
    }
  }
  
  public static generateTokens(user: UsersModel): { accessToken: string; refreshToken: string };
  public static generateTokens(user: UsersModel, type: 'access'): { accessToken: string };
  public static generateTokens(user: UsersModel, type: 'refresh'): { refreshToken: string };
  public static generateTokens(user: UsersModel, type?: TokenType): TokenResponse {
    const payload = { id: user.id, email: user.email };

    try {
      switch (type) {
        case 'access':
          return { accessToken: this.signToken(payload, this.accessSecret, this.accessTokenExpirationTime) };
        case 'refresh':
          return { refreshToken: this.signToken(payload, this.refreshSecret, this.refreshTokenExpirationTime) };
        default:
          return {
            accessToken: this.signToken(payload, this.accessSecret, this.accessTokenExpirationTime),
            refreshToken: this.signToken(payload, this.refreshSecret, this.refreshTokenExpirationTime),
          };
      }
    } catch {
      throw new ErrorApi(500, 'Error generating tokens');
    }
  }
}
