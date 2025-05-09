const { saveOrUpdatePlayer } = require('./mongo_schemas/player.js');
const Game = require('./mongo_schemas/game.js');
const Team = require('./mongo_schemas/team.js');
async function savePlayers(players) {
  try {
    for (const player of players) {
      await saveOrUpdatePlayer(player)
      console.log(`Jugador ${player._id} guardado en MongoDB`);
    }
  } catch (error) {
    console.error('Error al guardar jugadores:', error);
  }
}

async function saveGame(gameData) {
  try {
    const newGame = new Game(gameData);
    await newGame.save();
    console.log(`Partida ${gameData._id} guardada en MongoDB`);
  } catch (error) {
    console.error('Error al guardar partida:', error);
  }
}


async function saveTeams() {
  try {
    const teamsData = [
      { _id: 1, race: 'orc' },
      { _id: 2, race: 'human' },
      { _id: 3, race: 'vampire' },
      { _id: 4, race: 'slime' }
    ];

    for (const team of teamsData) {
      await Team.updateOne({ _id: team._id }, { $set: team }, { upsert: true });
      console.log(`Equipo ${team.race} guardado correctamente.`);
    }
  } catch (error) {
    console.error('Error al guardar los equipos:', error);
  }
}

module.exports = { savePlayers, saveGame, saveTeams };