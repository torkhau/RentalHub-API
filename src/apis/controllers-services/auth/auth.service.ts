import { compareSync, hashSync } from 'bcrypt';
import { Resend } from 'resend';
import { sequelizeInstance } from '../../../db';
import { UsersModel } from '../../../db/models';
import { ErrorApi } from '../../error';
import { AccessAndRefreshToken, JWTService } from '../../services';
import { Base } from '../abstract';
import { AuthData } from './types';

export class AuthService extends Base {
  private async sendEmail({ email, password }: AuthData): Promise<void> {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Hello World',
        html: `
              <h1>Hello <strong>NEW RENTER</strong></h1>
              <p>
                You have just successfully created a new account in the <strong><a href="https://releaseaudit.azurewebsites.net" rel="noopener" target="_blank">Assessment App</a></strong>.<br>
                To complete registration we need a little more information from you to verify your account.<br>
                Here you can find your login details:
                <ul>
                  <li>e-mail: <strong style='color: #FF5733;'>${email}</strong></li>
                  <li>password: <strong style='color: #FF5733;'>${password}</strong></li>
                </ul>
                Please sign in and complete verification.<br>
                We're excited you join us!
              </p>
              `,
      });
    } catch (error) {
      this.handleErrors(error, 'Failed to send email.');
    }
  }

  public async login({ email, password }: AuthData): Promise<{ user: UsersModel; tokens: AccessAndRefreshToken }> {
    try {
      const user = await UsersModel.findOne({ where: { email } });

      if (!user) throw new ErrorApi(404, `Email '${email}' not found. Verify and try again.`);

      if (!compareSync(password, user.password))
        throw new ErrorApi(401, 'E-mail or password is wrong. Verify and try again.');

      const tokens = JWTService.generateTokens(user);

      return { user, tokens };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  public async register({ email, password }: AuthData): Promise<UsersModel> {
    try {
      if (await UsersModel.count({ where: { email } })) throw new ErrorApi(422, 'User already exists.');

      const newUser = sequelizeInstance.transaction(async (transaction) => {
        const user = await UsersModel.create({ email, password: hashSync(password, 10) }, { transaction });

        await this.sendEmail({ email, password });

        return user;
      });

      return newUser;
    } catch (error) {
      this.handleErrors(error);
    }
  }
}
