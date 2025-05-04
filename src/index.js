const express = require('express');
const GameLogic = require('./gameLogic.js');
const webSockets = require('./utilsWebSockets.js');
const GameLoop = require('./utilsGameLoop.js');
const { Player } = require('./mongo_schemas/player.js')
const mongoose = require('mongoose');
const { savePlayers, saveGame, saveTeams } = require('./dbUtils.js');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bandera2', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conectado a MongoDB");
    await saveTeams();
  } catch (err) {
    console.log("se ha producido un error:\n"+err)
  }
}

connectDB();
let winner="";


async function saveGameData() {
  try {
    // Generar un ID único para la partida
    const gameId = `game_${Date.now()}`;

    // Extraer los jugadores participantes del juego
    const playersData = await Promise.all(
      Array.from(game.players.values()).map(async (player) => {
        // Consultar el jugador en MongoDB
        const dbPlayer = await Player.findOne({ _id: player.id });
        console.log("ganador: "+winner)
        // Calcular los nuevos valores basados en los datos actuales
        const high_score = Math.max(player.score || 0, dbPlayer?.high_score || 0);
        const games_played = (dbPlayer?.games_played || 0) + 1;
        const games_won =
        winner === player.id ? (dbPlayer?.games_won || 0) + 1 : dbPlayer?.games_won || 0;
        console.log("juego = "+ winner);
        console.log("jugador = "+player.id);
        // Retornar los datos actualizados
        return {
          _id: player.id,
          nickname: player.nickname || `Player_${player.id}`,
          location: player.location || 'Spain',
          high_score,
          games_played,
          games_won
        };
      })
    );

    // Guardar los jugadores en MongoDB
    await savePlayers(playersData);
    console.log("Datos de los jugadores guardados correctamente.");

    // Datos de la partida
    const gameData = {
      _id: gameId,
      high_score: Math.max(...Array.from(game.players.values()).map(player => player.score || 0)), // Puntuación más alta
      winner_team: winner ? game.players.get(winner).race : null, // Equipo ganador
      total_players: game.players.size, // Número total de jugadores
      total_viewers: ws.getClientsIds().filter(id => id.startsWith('S')).length, // Número total de espectadores
      duration: Math.floor(game.elapsedTime), // Duración de la partida
      players: Array.from(game.players.keys()), // Lista de IDs de los jugadores
    };

    // Guardar la partida en MongoDB
    await saveGame(gameData);
    console.log(`Partida ${gameId} guardada en MongoDB`);
  } catch (error) {
    console.error("Error al guardar los datos de la partida:", error);
  }
}
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
      clients = clients.filter(c => c==! id)
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
            const cuatre = clients.slice(0,4);
            game.addPlayers(cuatre)
            clients = clients.slice(4);
            ws.clientsRefused(clients);
            clients = clients.concat(cuatre);
            game.addKey();
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
gameLoop.run = async (fps) => {
  if (game.gameOver){
    console.log("Aturant partida");
    gameLoop.stop();
    winner = game.keys.get(1).keyOwnerId;
    ws.broadcast(JSON.stringify({type: "gameOver",winner: game.keys.get(1).keyOwnerId}));
    await saveGameData.call(this);
    game.removeKeys();
    game.removePlayers()
    countdown();
    return
  }
    game.updateGame(fps);
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
