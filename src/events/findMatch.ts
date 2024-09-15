import { Socket } from 'socket.io';
import { TelegramUser } from '../types';
import { Queue } from 'bullmq';

async function findMatch(socket: Socket) {
  const matchmakingQueue = new Queue('matchmaking');

  const user = socket.data.user as TelegramUser;

  const player = {
    socketId: socket.id,
    user,
  };

  const job = await matchmakingQueue.getJob(socket.id);
  if (job) {
    return;
  }

  await matchmakingQueue.add('player', player, {
    removeOnComplete: true,
    removeOnFail: true,
    jobId: socket.id,
  });
}

export default findMatch;
