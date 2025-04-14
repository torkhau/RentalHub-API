import { compareSync, hashSync } from 'bcrypt';
import { UsersModel } from '../../../db/models';
import { ErrorApi } from '../../error';
import { BaseService } from '../abstract';
import { AuthData } from './types';

export class AuthService extends BaseService {
  public async login({ email, password }: AuthData): Promise<UsersModel> {
    try {
      const user = await UsersModel.findOne({ where: { email } });

      if (!user) throw new ErrorApi(404, `Email '${email}' not found. Verify and try again.`);

      if (compareSync(password, user.password)) throw new ErrorApi(401, 'E-mail or password is wrong. Verify and try again.');

      return user;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  public async register({ email, password }: AuthData): Promise<UsersModel> {
    try {
      if (await UsersModel.count({ where: { email } })) throw new ErrorApi(422, 'User already exists.');

      password = hashSync(password, 10);
      const newUser = await UsersModel.create({ email, password });

      return newUser;
    } catch (error) {
      this.handleErrors(error);
    }
  }
}
