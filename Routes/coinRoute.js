const express = require('express');
const { getCoins, getHistoryById, storeSnapshot, getCurrentData } = require('../Controllers/coinController');
const router = express.Router();

router.get('/coins', getCoins);
router.post('/history', storeSnapshot);
router.get('/coin', getCurrentData);
router.get('/history/:coinId', getHistoryById);

module.exports = router;
