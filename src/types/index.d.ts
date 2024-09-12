import { Request } from 'express';

export interface AuthorisedRequest extends Request {
  user?: TelegramUser;
}

// TODO: update interface to include all data
export interface TelegramUser {
  id: number;
  username: string;
}
