class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(serverUrl) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);

      try {
        this.ws = new WebSocket(serverUrl);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          console.log('WebSocket connecté');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error('WebSocket erreur:', error.message || 'Connection failed');
          reject(new Error('Impossible de se connecter au serveur'));
        };

        this.ws.onclose = () => {
          console.log('WebSocket fermé');
          this.emit('disconnected', {});
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.emit(message.type, message);
          } catch (error) {
            console.error('Erreur parsing message:', error);
          }
        };
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  send(type, data = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  createRoom(pseudo) {
    this.send('CREATE_ROOM', { pseudo });
  }

  joinRoom(roomCode, pseudo) {
    this.send('JOIN_ROOM', { roomCode, pseudo });
  }

  startGame(roomCode, tracks) {
    this.send('START_GAME', { roomCode, tracks });
  }

  submitAnswer(roomCode, correct, points) {
    this.send('SUBMIT_ANSWER', { roomCode, correct, points });
  }

  nextTrack(roomCode) {
    this.send('NEXT_TRACK', { roomCode });
  }

  leaveRoom(roomCode) {
    this.send('LEAVE_ROOM', { roomCode });
  }
}

export const wsService = new WebSocketService();
