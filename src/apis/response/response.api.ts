export interface Message {
  text: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  toUser?: boolean;
  stack?: string;
}

export interface ResponseApi<T = null> {
  payload: T;
  message?: Message | string;
}