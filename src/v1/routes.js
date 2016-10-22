'use strict';

const express = require('express'),
    router = express.Router();

router.use('/', require('./api'));
router.use('/oauth2', require('./oauth2'));
router.use('/upload', require('./upload'));

module.exports = router;
