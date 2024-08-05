import { Server } from 'socket.io';

function setPlayersOnlineEvent(io: Server) {
  setInterval(() => {
    io.emit('playersOnline', io.engine.clientsCount);
  }, 1000);
}

export default setPlayersOnlineEvent;
