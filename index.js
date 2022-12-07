const getData = require('./services/notion');

;(async () => {
    const nData = await getData();
    console.log(nData);
})()