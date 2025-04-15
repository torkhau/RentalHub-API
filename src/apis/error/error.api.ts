import { Message } from '../response';

export class ErrorApi extends Error {
  public readonly status: number;
  public readonly customMessage: Message | string;


  constructor(status: number, message: Message | string) {
    super(typeof message === 'string' ? message : message.text);
    this.status = status;
    this.customMessage = message;

    if (process.env.NODE_ENV === 'development') Error.captureStackTrace(this, this.constructor);
  }
}
