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
let clients = [];

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
      clients.push(id)
      console.log("Clients: "+clients.length);
    }
    ws.broadcast(JSON.stringify({ type: "newSize", size: `${clients.length}`}));
};

ws.onMessage = (socket, id, msg) => {
    if (debug) console.log(`New message from ${id}: ${msg}`);
    game.handleMessage(id, msg);
};

ws.onClose = (socket, id) => {
    if (debug) console.log("WebSocket client disconnected: " + id);

    if (id[0] === 'C'){
      clients.pop(id)
      console.log("Clients: "+clients.length);
      try{
        game.removeClient(id)
      }catch{}
    }
    ws.broadcast(JSON.stringify({ type: "disconnected", from: "server" }));
    ws.broadcast(JSON.stringify({ type: "newSize", size: `${clients.length}`}));
};

function countdown() {
  let contador = 20
  const intervalId = setInterval(() => {
     console.log(`contador: ${contador}`);
     contador--; 
     if (contador<0){
         clearInterval(intervalId);
         console.log("ha acabat");
         if (clients.length>=1){
            console.log("Comença partida");
            if (clients.length>4){
              game.addPlayers(clients[3])
            }else{
              game.addPlayers(clients)
            }
            game.elapsedTime=0;
            game.gameOver = false; 
            gameLoop.start(); 
            ws.broadcast(JSON.stringify({ type: "gameStart" }));          
         }else{
            console.log("No hi han suficients jugadors");
            setTimeout(() => countdown(), 1000);
            ws.broadcast(JSON.stringify({type:"restart"}));
         }
      }else{
        ws.broadcast(JSON.stringify({type: "countdown", timeleft: contador}));
      }

  }, 1000);
}

countdown()


// **Game Loop**
gameLoop.run = (fps) => {
  if (game.gameOver){
    console.log("Aturant partida");
    gameLoop.stop();
    ws.broadcast(JSON.stringify({type: "gameOver",winner: game.keyOwnerId}));
    countdown();
    return
  }
    game.updateGame(fps);
    console.log("temps index: "+ game.elapsedTime)
    ws.broadcast(JSON.stringify({ type: "update", gameState: game.getGameState() }));
};

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
