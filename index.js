'use strict';

const express = require('express'),
    app = module.exports = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', require('./src/versions'));


app.listen(8000, function () {
    console.log('Listening on port 8000');
});

