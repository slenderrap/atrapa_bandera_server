//configuración de conexión de jugador

const { v4: uuidv4 } = require("uuid");
const players = [];

function addPlayer(ws){
    const playerID = uuidv4();
    players.add(ws)

    broadcastPlayerCount();
}

function removePlayer(ws){
    
    players[playerID] = ws

    broadcastPlayerCount();
}