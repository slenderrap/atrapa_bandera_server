const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  _id: String, 
  high_score: Number,
  winner_team: String, 
  total_players: Number,
  total_viewers: Number,
  duration: Number, 
  date: { type: Date, default: Date.now },
  players: [String],
  viewers: [String] 
});

module.exports = mongoose.model('Game', gameSchema);