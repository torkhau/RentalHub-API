import { Endpoint } from '../../../routes/abstract';

export class AuthController {
  public get routes(): Endpoint[] {
    return [
      {
        path: '/login',
        method: 'get',
        handler: (_req, res) => {
          res.send('Login');
        },
      },
      {
        path: '/register',
        method: 'get',
        handler: (_req, res) => {
          res.send('Register');
        },
      },
    ];
  }
}
