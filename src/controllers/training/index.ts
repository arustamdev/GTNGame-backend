import { NextFunction, Response } from 'express';
import { AuthorisedRequest } from '../../types';

import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import { compareNumbers, generateRandomNumber, validateNumber } from '../utils';

const prisma = new PrismaClient();

export async function training(req: AuthorisedRequest, res: Response, next: NextFunction) {
  const tgId = req.user!.id;

  try {
    const trainingSession = await prisma.training.findUnique({ where: { tgId } });

    //Training session doesnt exist yet so we create a new one
    if (!trainingSession) {
      const guessInt = generateRandomNumber();

      await prisma.training.create({
        data: {
          tgId,
          guessInt,
          finished: false,
        },
      });

      return res.json({ isFinished: false }).end();
    }

    //Training session exists so we response with its status
    return res.json({ isFinished: trainingSession.finished }).end();
  } catch (error) {
    next(error);
  }
}

export async function guess(req: AuthorisedRequest, res: Response, next: NextFunction) {
  const tgId = req.user!.id;
  const guessedNumber: string = req.body.number;

  if (!validateNumber(guessedNumber)) {
    return res.status(400).end();
  }

  try {
    const trainingSession = await prisma.training.findUnique({ where: { tgId } });
    if (!trainingSession) {
      return res.status(400).end();
    }

    const actualNumber = trainingSession.guessInt;

    const matches = compareNumbers(guessedNumber, actualNumber);

    if (matches === actualNumber.length) {
      await prisma.training.update({
        where: { tgId },
        data: {
          finished: true,
        },
      });
    }

    return res.json({ matches }).end();
  } catch (error) {
    next(error);
  }
}

export async function restart(req: AuthorisedRequest, res: Response, next: NextFunction) {
  const tgId = req.user!.id;

  try {
    const trainingSession = await prisma.training.findUnique({ where: { tgId } });
    if (!trainingSession) {
      return res.status(400).end();
    }

    const guessInt = generateRandomNumber();

    await prisma.training.update({
      where: { tgId },
      data: {
        guessInt,
        finished: false,
      },
    });

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
}
