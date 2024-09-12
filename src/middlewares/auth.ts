import { NextFunction, Response, Request } from 'express';
import crypto from 'crypto';
import { AuthorisedRequest } from '../types';
import validateTelegramData from '../utils/auth';

export default function auth(req: AuthorisedRequest, res: Response, next: NextFunction) {
  const initData = req.headers['telegram-data'] as string;

  if (!initData) {
    return res.status(401).end();
  }

  const user = validateTelegramData(initData);

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
}
