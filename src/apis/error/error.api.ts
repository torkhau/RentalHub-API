export class ErrorApi extends Error {
  public readonly status: number;
  public readonly message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;

    if (process.env.NODE_ENV === 'development') Error.captureStackTrace(this, this.constructor);
  }
}
