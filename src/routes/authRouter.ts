import { AuthController } from '../apis/controllers-services/auth';
import { BaseRoutes } from './abstract/baseRoutes';

export class AuthRouter extends BaseRoutes {
  constructor() {
    super();
    this.generateRoutes(new AuthController().endpoints);
  }
}
