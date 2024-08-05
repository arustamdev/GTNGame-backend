import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import api from './api';
import errorHandler from './errorHandler';

import setPlayersOnlineEvent from './events/playersOnline';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
  },
});

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`);
});

setPlayersOnlineEvent(io);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', api);

app.use(errorHandler);

export default server;
