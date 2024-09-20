import { NextFunction, Response } from 'express';
import { AuthorisedRequest } from '../../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function setGuessNumber(req: AuthorisedRequest, res: Response, next: NextFunction) {
  const tgId = req.user!.id;
  const number = req.body.number;

  console.log(number);

  if (!number) {
    return res.status(400).end();
  }

  const isValid = /^\d{4}$/.test(number);

  console.log(isValid);
  if (!isValid) {
    return res.status(400).end();
  }

  try {
    await prisma.guessNumber.upsert({
      where: {
        tgId,
      },
      update: {
        guessNumber: number,
      },
      create: {
        tgId,
        guessNumber: number,
      },
    });

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
}
