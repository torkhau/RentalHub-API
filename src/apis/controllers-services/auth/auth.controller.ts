import { NextFunction, Request, Response } from 'express';
import isEmail from 'validator/lib/isEmail';
import { Endpoint } from '../../../routes/abstract';
import { ErrorApi } from '../../error';
import { AuthService } from './auth.service';
import { AuthData } from './types';

export class AuthController {
  private readonly service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  private validateAuthData(email?: string, password?: string): AuthData {
    email = email?.trim();
    password = password?.toLowerCase().trim();

    if (!email || !password) throw new ErrorApi(422, 'Username and password are required.');

    if (!isEmail(email)) throw new ErrorApi(422, 'Invalid email format.');

    return { email, password };
  }

  protected login({ body: { email, password } }: Request, res: Response, next: NextFunction): void {
    try {
      const authData = this.validateAuthData(email, password);
    } catch (error) {
      next(error);
    }
  }

  protected async register({ body: { email, password } }: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authData = this.validateAuthData(email, password);

      await this.service.register(authData);
      res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public get routes(): Endpoint[] {
    return [
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
  }
}
