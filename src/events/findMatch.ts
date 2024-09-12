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

  await matchmakingQueue.add('player', player);

  console.log(await matchmakingQueue.getWaiting());
}

export default findMatch;
