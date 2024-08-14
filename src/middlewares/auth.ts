import { NextFunction, Response, Request } from 'express';
import crypto from 'crypto';
import { AuthorisedRequest } from '../types';

export default function auth(req: AuthorisedRequest, res: Response, next: NextFunction) {
  const initData = req.headers['telegram-data'] as string;

  if (!initData) {
    return res.status(401).end();
  }

  // parse string to get params
  const searchParams = new URLSearchParams(initData);

  // take the hash and remove it from params list
  const hash = searchParams.get('hash');
  searchParams.delete('hash');

  // sort params
  const restKeys = Array.from(searchParams.entries());
  restKeys.sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

  const dataCheckString = restKeys.map(([n, v]) => `${n}=${v}`).join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN!).digest();

  const validationHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (validationHash !== hash) {
    return res.status(401).end();
  }

  const rawUser = searchParams.get('user');

  if (!rawUser) {
    return res.status(401).end();
  }
  req.user = JSON.parse(rawUser);
  next();
}
