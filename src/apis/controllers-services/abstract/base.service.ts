import { ErrorApi } from '../../error';

export abstract class BaseService {
  protected handleErrors(error: unknown, message = 'Internal server error.'): never {
    if (error instanceof ErrorApi) throw error;

    throw new ErrorApi(500, message);
  }
}
