import { CookieOptions, NextFunction, Request, Response } from 'express';
import isEmail from 'validator/lib/isEmail';
import { Endpoint } from '../../../routes/abstract';
import { ErrorApi } from '../../error';
import { JWTService } from '../../services';
import { AuthService } from './auth.service';
import { AuthData } from './types';
import { UserController } from '../user';

export class AuthController {
  private readonly service: AuthService = new AuthService();
  public readonly endpoints: Endpoint[] = [
    {
      path: '/login',
      method: 'post',
      handler: (req, res, next) => this.login(req, res, next),
    },
    {
      path: '/register',
      method: 'post',
      handler: (req, res, next) => this.register(req, res, next),
    },
  ];

  private generateCookieOptions(maxAge: number): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: maxAge * 1000,
    };
  }

  private validateAuthData(email?: string, password?: string): AuthData {
    email = email?.toLowerCase().trim();
    password = password?.trim();

    if (!email || !password) throw new ErrorApi(422, 'Username and password are required.');

    if (!isEmail(email)) throw new ErrorApi(422, 'Invalid email format.');

    return { email, password };
  }

  protected async login({ body: { email, password } }: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authData = this.validateAuthData(email, password);
      const { user, tokens } = await this.service.login(authData);
      const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;
      res
        .cookie(
          'refreshToken',
          tokens.refreshToken,
          this.generateCookieOptions(JWTService.REFRESH_TOKEN_EXPIRATION_TIME)
        )
        .cookie('accessToken', tokens.accessToken, this.generateCookieOptions(JWTService.ACCESS_TOKEN_EXPIRATION_TIME))
        .status(200)
        .json({
          payload: { user: UserController.toDTO(user) },
          message: `Hello, ${userName}.`,
        });
    } catch (error) {
      next(error as ErrorApi);
    }
  }

  protected async register({ body: { email, password } }: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authData = this.validateAuthData(email, password);

      await this.service.register(authData);
      res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
      next(error as ErrorApi);
    }
  }
}
