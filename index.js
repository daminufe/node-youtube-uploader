'use strict';

const Youtube = require('youtube-api'),
    fs = require('fs'),
    Lien = require('lien'),
    prettyBytes = require('pretty-bytes');

// Init lien server
let server = new Lien({
    host: 'localhost',
    port: 8000
});

server.addPage('/oauth2', function (lien) {
    const CREDENTIALS = {
        web:{
            client_id: process.env.YOUTUBE_CLIENT_ID,
            client_secret: process.env.YOUTUBE_CLIENT_SECRET,
            project_id: process.env.YOUTUBE_PROJECT_ID,
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://accounts.google.com/o/oauth2/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            redirect_uris: ['http://localhost:8000/oauth2/callback'],
            javascript_origins: ['http://localhost:8000']
        }
    };

    // Authenticate
    let oauth = Youtube.authenticate({
        type: 'oauth',
        client_id: CREDENTIALS.web.client_id,
        client_secret: CREDENTIALS.web.client_secret,
        redirect_url: CREDENTIALS.web.redirect_uris[0]
    });

    lien.end(oauth.generateAuthUrl ({
        access_type: 'offline',
        approval_prompt: 'force',
        scope: ['https://www.googleapis.com/auth/youtube.upload']
    }));

});


// Handle oauth2 callback
server.addPage('/oauth2/callback', lien => {
    console.log('Trying to get the token using the following code: ' + lien.query.code);
    oauth.getToken(lien.query.code, (err, tokens) => {

        if (err) {
            return console.log(err);
        }

        console.log('Got the tokens.');
        console.log(tokens);

        lien.end(`<script>window.close();</script>`);
    });
});

// Handle oauth2 callback
server.addPage('/upload', function (lien) {
    const tokens = {
        access_token: process.env.YOUTUBE_ACCESS_TOKEN,
        token_type: 'Bearer',
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
        expiry_date: process.env.YOUTUBE_EXPIRY_DATE
    };

    oauth.setCredentials(tokens);

    lien.end('The video is being uploaded. Check out the logs in the terminal.');

    let intervalId = setInterval(function () {
        console.log = (msg) => {
            process.stdout.write(`${msg}\n`);
        };
        console.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
    }, 250);

    let req = Youtube.videos.insert({
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
            body: fs.createReadStream('video.mov')
        }
    }, function (err, data) {
        console.log('Done.');
        clearInterval(intervalId);
    });


});
