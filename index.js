'use strict';

/**
 * This script uploads a video (specifically `video.mp4` from the current
 * directory) to YouTube,
 *
 * To run this script you have to create OAuth2 credentials and download them
 * as JSON and replace the `credentials.json` file. Then install the
 * dependencies:
 *
 * npm i r-json lien opn bug-killer
 *
 * Don't forget to run an `npm i` to install the `youtube-api` dependencies.
 * */

const Youtube = require('youtube-api'),
    fs = require('fs'),
    Lien = require('lien'),
    prettyBytes = require('pretty-bytes');

// I downloaded the file from OAuth2 -> Download JSON
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

// Init lien server
let server = new Lien({
    host: 'localhost',
    port: 8000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
    type: 'oauth',
    client_id: CREDENTIALS.web.client_id,
    client_secret: CREDENTIALS.web.client_secret,
    redirect_url: CREDENTIALS.web.redirect_uris[0]
});

console.log(oauth.generateAuthUrl({
    access_type: 'offline', scope: ['https://www.googleapis.com/auth/youtube.upload']
}));

// Handle oauth2 callback
server.addPage('/oauth2/callback', lien => {
    console.log('Trying to get the token using the following code: ' + lien.query.code);
    oauth.getToken(lien.query.code, (err, tokens) => {

        if (err) {
            lien.lien(err, 400);
            return console.log(err);
        }

        console.log('Got the tokens.');

        oauth.setCredentials(tokens);

        lien.end('The video is being uploaded. Check out the logs in the terminal.');

        var req = Youtube.videos.insert({
            resource: {
                // Video title and description
                snippet: {
                    title: 'Testing YoutTube API NodeJS module',
                    description: 'Test video upload via YouTube API'
                },
                // I don't want to spam my subscribers
                status: {
                    privacyStatus: 'private'
                }
            },
            // This is for the callback function
            part: 'snippet,status',

            // Create the readable stream to upload the video
            media: {
                body: fs.createReadStream('video.mov')
            }
        }, (err, data) => {
            console.log('Done.');
            process.exit();
        });

        setInterval(function () {
            console.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
        }, 250);
    });
});
