const mongoose = require('mongoose');

// Definir el esquema del jugador
const playerSchema = new mongoose.Schema({
  _id:  { type: String, required: true }, 
  nickname: { type: String, required: true }, 
  location: { type: String, default: 'Spain' },
  email: { type: String, required: true, unique: true },
  phone: { type: String }, 
  token: { type: String, required: true},
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String }, 
  high_score: { type: Number, default: 0 }, 
  games_played: { type: Number, default: 0 }, 
  games_won: { type: Number, default: 0 }, 
  creation_date: { type: Date, default: Date.now } 
});

// Crear el modelo de jugador
const Player = mongoose.model('Player', playerSchema);

const verifyToken = async (token) => {
  try {
    const player = await Player.findOne({ tokens: token });
    return !!player; // Retorna `true` si el jugador existe, `false` en caso contrario
  } catch (error) {
    throw new Error(`Error verifying token: ${error.message}`);
  }
};

// Función para guardar o actualizar un jugador
async function saveOrUpdatePlayer(playerData) {
  try {
    const { _id, ...restOfData } = playerData;

    // Buscar por _id y actualizar o crear el documento
    const result = await Player.updateOne(
      { _id }, 
      { $set: restOfData }, 
      { upsert: true } 
    );

    console.log(`Resultado de la operación:`, result);

    if (result.upserted) {
      console.log(`Jugador creado con ID: ${_id}`);
    } else {
      console.log(`Jugador actualizado con ID: ${_id}`);
    }
  } catch (error) {
    console.error(`Error al guardar/actualizar jugador con ID ${playerData._id}:`, error);
  }
}

// Exportar el modelo y la función
module.exports = { Player, saveOrUpdatePlayer, verifyToken };