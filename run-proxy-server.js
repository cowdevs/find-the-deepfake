const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    request({url: url}).pipe(res);
});

app.listen(3000, () => {
    console.log('Proxy server is running on port 3000');
});