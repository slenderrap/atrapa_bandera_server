const express = require('express');
const GameLogic = require('./gameLogic.js');
const webSockets = require('./utilsWebSockets.js');
const GameLoop = require('./utilsGameLoop.js');

const debug = true;
const port = process.env.PORT || 8888;
const host = process.env.HOST || 'localhost';

// Inicialitzar WebSockets i la lògica del joc
const ws = new webSockets();
const game = new GameLogic();
let gameLoop = new GameLoop();

// Inicialitzar servidor Express
const app = express();
app.use(express.static('public'));
app.use(express.json());

// Inicialitzar servidor HTTP
const httpServer = app.listen(port, () => {
    console.log(`Servidor HTTP escoltant a: http://${host}:${port}`);
});

// Gestionar WebSockets
ws.init(httpServer, port);

ws.onConnection = (socket, id) => {
    if (debug) console.log("WebSocket client connected: " + id);
    if (id[0] === 'C'){
      game.addClient(id);
      console.log("Clients: "+game.players.size);
    }
    ws.broadcast(JSON.stringify({ type: "newSize", size: `${game.players.size}`}));
};

ws.onMessage = (socket, id, msg) => {
    if (debug) console.log(`New message from ${id}: ${msg}`);
    game.handleMessage(id, msg);
};

ws.onClose = (socket, id) => {
    if (debug) console.log("WebSocket client disconnected: " + id);

    if (id[0] === 'C'){
      game.removeClient(id);
      console.log("Clients: "+game.players.size);
    }
    ws.broadcast(JSON.stringify({ type: "disconnected", from: "server" }));
    ws.broadcast(JSON.stringify({ type: "newSize", size: `${game.players.size}`}));
};

// **Game Loop**
gameLoop.run = (fps) => {
    game.updateGame(fps);
    ws.broadcast(JSON.stringify({ type: "update", gameState: game.getGameState() }));
};
gameLoop.start();

// Gestionar el tancament del servidor
let shuttingDown = false;
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(signal => {
  process.once(signal, shutDown);
});
function shutDown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log('Rebuda senyal de tancament, aturant el servidor...');
  httpServer.close(() => {
    ws.end();
    gameLoop.stop();
    process.exit(0);
  });
}
