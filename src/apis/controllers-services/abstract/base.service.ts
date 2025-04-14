import { ErrorApi } from '../../error';

export abstract class BaseService {
  protected handleErrors(error: unknown): never {
    if (error instanceof ErrorApi) throw error;

    throw new ErrorApi(500, 'Internal server error.');
  }
}
