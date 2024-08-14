import { Response } from 'express';
import { AuthorisedRequest } from '../../types';

import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

export async function training(req: AuthorisedRequest, res: Response) {
  const tgId = req.user!.id;

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
}

function generateRandomNumber() {
  const number = randomInt(0, 10000);
  if (number < 1000) {
    return number.toString().padStart(4, '0');
  }
  return number.toString();
}
