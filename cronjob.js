const cron = require('node-cron');
const request = require('request');


console.log("cron task ative")
cron.schedule('* * * * *', () => {
    request('http://127.0.0.1:3000/get');
    console.log('running a task every minute');
});


