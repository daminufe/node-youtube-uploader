'use strict';

const express = require('express'),
    router = express.Router(),
    oauth = require('./config/oauth.config.js');

router.get('/', oauth2);
router.get('/callback', oauth2Callback);

module.exports = router;



function oauth2 (req, res) {
    let authUrl = oauth.generateAuthUrl ({
        access_type: 'offline',
        approval_prompt: 'force',
        scope: ['https://www.googleapis.com/auth/youtube.upload']
    });

    res.send({ authUrl });

}

function oauth2Callback (req, res) {
    oauth.getToken(req.query.code, function (err, tokens) {
        if (err) {
            console.error(err);
            return res.status(err.code).send(err);
        }

        console.log('Got the tokens.');
        process.env.YOUTUBE_ACCESS_TOKEN = tokens.access_token;
        process.env.YOUTUBE_REFRESH_TOKEN = tokens.refresh_token;
        process.env.YOUTUBE_EXPIRY_DATE = tokens.expiry_date;
console.info(tokens);
        res.send({
            success: true
        });
    });
}
