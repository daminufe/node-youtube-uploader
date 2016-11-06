'use strict';

const express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs'),
    prettyBytes = require('pretty-bytes'),
    oauth = require('./config/oauth.config.js'),
    Youtube = require('youtube-api');

router.post('/', getRaw, upload);

module.exports = router;

function getRaw (req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });

    req.on('end', function() {
        next();
    });
}

function upload (req, res) {
    const tokens = {
        access_token: process.env.YOUTUBE_ACCESS_TOKEN,
        token_type: 'Bearer',
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
        expiry_date: process.env.YOUTUBE_EXPIRY_DATE
    };

    oauth.setCredentials(tokens);

    let buffer = Buffer.from(req.rawBody);
    let arraybuffer = Uint8Array.from(buffer).buffer;

    let options = {
        resource: {
            snippet: {
                title: req.query.title,
                description: req.query.description
            },
            status: {
                privacyStatus: 'unlisted'
            }
        },
        part: 'snippet,status',
        media: {
            body: arraybuffer
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
