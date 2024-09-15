import { Job, Queue, Worker } from 'bullmq';
import { Server } from 'socket.io';
import { JobData } from '../types';

export async function runMatchmakingWorker(io: Server) {
  const matchmakingQueue = new Queue('matchmaking');

  const worker = new Worker(
    'matchmaking',
    async (job: Job<JobData>) => {
      let waited = await matchmakingQueue.getWaiting(0, 1);
      while (waited.length === 0) {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
          }, 3000);
        });
        waited = await matchmakingQueue.getWaiting(0, 1);
      }
      const job2 = waited[0] as Job<JobData>;
      await job2.remove();

      io.to(job.data.socketId).emit('matchfound', job2.data);
      io.to(job2.data.socketId).emit('matchfound', job.data);
      console.log(`Paired ${job.data.user.username} and ${job2.data.user.username}`);
    },
    {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    },
  );
}
