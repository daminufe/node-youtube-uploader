'use strict';

const express = require('express'),
    router = express.Router();

router.get('/', index);

module.exports = router;

function index (req, res) {
    res.send({
        status: 'running'
    });
}
