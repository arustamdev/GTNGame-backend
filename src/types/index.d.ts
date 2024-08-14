import { Request } from 'express';

export interface AuthorisedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}
