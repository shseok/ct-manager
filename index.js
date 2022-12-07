const getData = require('./services/notion');
const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

// get > http://localhost:5000/histories
app.get('/histories', async (req, res) => {
    const data = await getData();
    res.json(data);
})
app.listen(PORT, console.log(`Server started on port ${PORT}`));
