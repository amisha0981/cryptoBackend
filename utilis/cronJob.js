const cron = require('node-cron');
const coinController = require('../Controllers/coinController');

const startCronJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Cron job started for current data'); 
      await coinController.getCoins();
      console.log('Cron job executed: current data stored');
      await coinController.storeSnapshot();
      console.log('Cron job executed: snapshot stored');
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
};

module.exports = startCronJob;

