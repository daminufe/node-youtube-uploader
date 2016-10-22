'use strict';

const express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs'),
    prettyBytes = require('pretty-bytes'),
    oauth = require('./config/oauth.config.js'),
    Youtube = require('youtube-api');

router.get('/', upload);

module.exports = router;

function upload (req, res) {
    const tokens = {
        access_token: process.env.YOUTUBE_ACCESS_TOKEN,
        token_type: 'Bearer',
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
        expiry_date: process.env.YOUTUBE_EXPIRY_DATE
    };

    oauth.setCredentials(tokens);

    let options = {
        resource: {
            snippet: {
                title: 'Test 2',
                description: 'This is one more test'
            },
            status: {
                privacyStatus: 'unlisted'
            }
        },
        part: 'snippet,status',
        media: {
            body: fs.createReadStream('./video.mov')
        }
    };

    Youtube.videos.insert(options, callback);

    function callback (err, data) {
        if (err) {
            console.error(err);
            return res.status(err.code).send(err);
        }

        res.send(data);
    }
}
