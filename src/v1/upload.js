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

    let youtubeRequest = Youtube.videos.insert({
        resource: {
            // Video title and description
            snippet: {
                title: 'Test 2',
                description: 'This is one more test'
            },
            // I don't want to spam my subscribers
            status: {
                privacyStatus: 'unlisted'
            }
        },
        // This is for the callback function
        part: 'snippet,status',

        // Create the readable stream to upload the video
        media: {
            body: fs.createReadStream('./video.mov')
        }
    }, function (err, data) {
        if (err) {
            return console.error(err);
        }

        res.send(data);
    });
}
