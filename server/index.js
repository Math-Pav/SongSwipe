const WebSocket = require('ws');

const PORT = 3001;
const wss = new WebSocket.Server({ port: PORT, host: '0.0.0.0' });

const rooms = {};

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const broadcast = (roomCode, message) => {
  const room = rooms[roomCode];
  if (!room) return;
  
  room.players.forEach(player => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(message));
    }
  });
};

const removePlayerFromRoom = (ws) => {
  for (const roomCode in rooms) {
    const room = rooms[roomCode];
    const playerIndex = room.players.findIndex(p => p.ws === ws);
    
    if (playerIndex !== -1) {
      const player = room.players[playerIndex];
      room.players.splice(playerIndex, 1);
      
      if (room.players.length === 0) {
        delete rooms[roomCode];
      } else {
        if (player.isHost && room.players.length > 0) {
          room.players[0].isHost = true;
          room.hostId = room.players[0].id;
        }
        
        broadcast(roomCode, {
          type: 'PLAYER_LEFT',
          playerId: player.id,
          players: room.players.map(p => ({ id: p.id, pseudo: p.pseudo, isHost: p.isHost })),
          newHostId: room.hostId,
        });
      }
      break;
    }
  }
};

wss.on('connection', (ws) => {
  console.log('Nouveau client connecté');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'CREATE_ROOM': {
          let roomCode = generateCode();
          while (rooms[roomCode]) {
            roomCode = generateCode();
          }
          
          const playerId = Date.now().toString();
          rooms[roomCode] = {
            hostId: playerId,
            players: [{
              id: playerId,
              pseudo: message.pseudo,
              ws: ws,
              isHost: true,
              score: 0,
            }],
            gameState: 'waiting',
            currentTrackIndex: 0,
            tracks: [],
          };
          
          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            roomCode: roomCode,
            playerId: playerId,
            players: [{ id: playerId, pseudo: message.pseudo, isHost: true }],
          }));
          break;
        }
        
        case 'JOIN_ROOM': {
          const room = rooms[message.roomCode];
          
          if (!room) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Code invalide' }));
            return;
          }
          
          if (room.gameState !== 'waiting') {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Partie déjà en cours' }));
            return;
          }
          
          if (room.players.length >= 8) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Salle pleine' }));
            return;
          }
          
          const playerId = Date.now().toString();
          room.players.push({
            id: playerId,
            pseudo: message.pseudo,
            ws: ws,
            isHost: false,
            score: 0,
          });
          
          ws.send(JSON.stringify({
            type: 'JOINED_ROOM',
            roomCode: message.roomCode,
            playerId: playerId,
            players: room.players.map(p => ({ id: p.id, pseudo: p.pseudo, isHost: p.isHost })),
          }));
          
          broadcast(message.roomCode, {
            type: 'PLAYER_JOINED',
            players: room.players.map(p => ({ id: p.id, pseudo: p.pseudo, isHost: p.isHost })),
          });
          break;
        }
        
        case 'START_GAME': {
          const room = rooms[message.roomCode];
          
          if (!room) return;
          
          const player = room.players.find(p => p.ws === ws);
          if (!player || !player.isHost) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Seul l\'hôte peut lancer' }));
            return;
          }
          
          if (room.players.length < 2) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Minimum 2 joueurs' }));
            return;
          }
          
          room.gameState = 'playing';
          room.tracks = message.tracks || [];
          room.currentTrackIndex = 0;
          
          room.players.forEach(p => p.score = 0);
          
          broadcast(message.roomCode, {
            type: 'GAME_STARTED',
            tracks: room.tracks,
            currentTrackIndex: 0,
          });
          break;
        }
        
        case 'SUBMIT_ANSWER': {
          const room = rooms[message.roomCode];
          if (!room || room.gameState !== 'playing') return;
          
          const player = room.players.find(p => p.ws === ws);
          if (!player) return;
          
          if (message.correct) {
            player.score += message.points || 1;
          }
          
          broadcast(message.roomCode, {
            type: 'PLAYER_ANSWERED',
            playerId: player.id,
            pseudo: player.pseudo,
            correct: message.correct,
            scores: room.players.map(p => ({ id: p.id, pseudo: p.pseudo, score: p.score })),
          });
          break;
        }
        
        case 'NEXT_TRACK': {
          const room = rooms[message.roomCode];
          if (!room) return;
          
          const player = room.players.find(p => p.ws === ws);
          if (!player || !player.isHost) return;
          
          room.currentTrackIndex++;
          
          if (room.currentTrackIndex >= room.tracks.length) {
            room.gameState = 'finished';
            broadcast(message.roomCode, {
              type: 'GAME_FINISHED',
              finalScores: room.players
                .map(p => ({ id: p.id, pseudo: p.pseudo, score: p.score }))
                .sort((a, b) => b.score - a.score),
            });
          } else {
            broadcast(message.roomCode, {
              type: 'NEXT_TRACK',
              currentTrackIndex: room.currentTrackIndex,
            });
          }
          break;
        }
        
        case 'LEAVE_ROOM': {
          removePlayerFromRoom(ws);
          break;
        }
      }
    } catch (error) {
      console.error('Erreur message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client déconnecté');
    removePlayerFromRoom(ws);
  });
});

console.log(`Serveur WebSocket démarré sur le port ${PORT}`);
