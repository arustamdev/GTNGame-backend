import crypto from 'crypto';
import { TelegramUser } from '../types';

export default function validateTelegramData(initData: string): TelegramUser | null {
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
    return null;
  }

  const rawUser = searchParams.get('user');

  if (!rawUser) {
    return null;
  }

  return JSON.parse(rawUser);
}
