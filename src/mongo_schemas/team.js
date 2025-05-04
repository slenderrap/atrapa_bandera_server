const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  _id: Number, 
  race: { type: String, enum: ['orc', 'human', 'vampire', 'slime'] } 
});

module.exports = mongoose.model('Team', teamSchema);