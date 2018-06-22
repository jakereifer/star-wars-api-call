var express = require('express');
var app = express();
app.get('/api/random-number', function (req, res) {
    var randomNumber = Math.floor(Math.random() * 20 + 1);
    var randomNumberString = String(randomNumber);
    res.send(randomNumberString);
});
app.listen(3000);
