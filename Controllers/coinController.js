const CurrentData = require('../Models/currentData');
const HistoryData = require('../Models/historyData');
const axios = require('axios');

// get coin & stire in db 
exports.getCoins = async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, page: 1 }
    });
    const coins = response.data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date()
    }));
    if (!coins.length) throw new Error('No data fetched from CoinGecko');
    await CurrentData.deleteMany({});
    await CurrentData.insertMany(coins);
    if (res) {
      return res.status(200).json({ status: true, message: 'Coins fetched successfully', data: coins });
    }
  } catch (error) {
    if (res) {
      return res.status(500).json({ status: false, message: error.message || 'Failed to fetch coins', data: [] });
    } else {
      console.error('Cron job error in getCoins:', error.message);
    }
  }
};


// store data in history data 
exports.storeSnapshot = async (req, res) => {
  try {
    const coins = await CurrentData.find();
    if (!coins.length) {
      if (res) return res.status(200).json({ status: true, message: 'No coins to snapshot', data: [] });
      return;
    }
    const historyCoins = coins.map(coin => ({
      _id : coin._id,
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      change24h: coin.change24h,
      timestamp: new Date()
    }));
    await HistoryData.insertMany(historyCoins);
    if (res) {
      return res.status(200).json({ status: true, message: 'Snapshot stored', data: historyCoins });
    }
  } catch (error) {
    if (res) {
      return res.status(500).json({ status: false, message: error.message || 'Failed to store snapshot', data: [] });
    } else {
      console.error('Cron job error in storeSnapshot:', error.message);
    }
  }
};


// get current data 
exports.getCurrentData = async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' }; 
    }
    if (req.query.symbol) {
      query.symbol = { $regex: req.query.symbol, $options: 'i' };
    }
    const data = await CurrentData.find(query).limit(10);
    if (!data.length) return res.status(200).json({ status: true, message: 'No data found', data: [] });
    return res.status(200).json({ status: true, message: 'Current Data fetched successfully', data: data });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || 'Failed to fetch data', data: [] });
  }
};


// get history data 
exports.getHistoryById = async (req, res) => {
  try {
    const { coinId } = req.params;
    if (!coinId) return res.status(400).json({ message: 'Coin ID is required' });
    const history = await HistoryData.findOne({ _id :  coinId });
    if (!history) return res.status(200).json({ status: true, message: 'No history found', data: [] });
    return res.status(200).json({ status: true, message: 'History fetched successfully', data: history });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || 'Failed to fetch history', data: [] });
  }
};


