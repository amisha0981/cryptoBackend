const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  marketCap: { type: Number, required: true, min: 0 },
  change24h: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('HistoryData', historySchema);


