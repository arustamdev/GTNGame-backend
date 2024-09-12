import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto';

import api from './api';
import errorHandler from './errorHandler';

import setPlayersOnlineEvent from './events/playersOnline';
import validateTelegramData from './utils/auth';
import findMatch from './events/findMatch';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
  },
});

io.use((socket, next) => {
  const initData = socket.handshake.auth.telegram_data as string | undefined;

  if (!initData) {
    next(new Error('Bad credentials'));
    return;
  }
  const user = validateTelegramData(initData);

  if (!user) {
    next(new Error('Bad credentials'));
    return;
  }

  socket.data.user = user;
  next();
});

io.on('connection', (socket) => {
  console.log(`[${socket.id}]: connected`);

  //events
  socket.on('findMatch', async () => {
    await findMatch(socket);
  });

  socket.on('disconnect', () => {
    console.log(`[${socket.id}]: disconnected`);
  });
});

setPlayersOnlineEvent(io);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', api);

app.use(errorHandler);

export default server;
