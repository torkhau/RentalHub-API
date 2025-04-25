import { ErrorApi } from '../../error';

export abstract class Base {
  protected handleErrors(error: unknown, message = 'Internal server error.'): never {
    if (error instanceof ErrorApi) throw error;

    throw new ErrorApi(500, message);
  }

  protected parseError(error: unknown, message = 'Internal server error.'): ErrorApi {
    if (error instanceof ErrorApi) return error;

    return new ErrorApi(500, message);
  }
}
