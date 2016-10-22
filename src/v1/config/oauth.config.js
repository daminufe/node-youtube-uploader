'use strict';

const Youtube = require('youtube-api'),
    credentials = {
        web:{
            client_id: process.env.YOUTUBE_CLIENT_ID,
            client_secret: process.env.YOUTUBE_CLIENT_SECRET,
            project_id: process.env.YOUTUBE_PROJECT_ID,
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://accounts.google.com/o/oauth2/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            redirect_uris: ['http://localhost:8000/api/v1/oauth2/callback'],
            javascript_origins: ['http://localhost:8000']
        }
    };

module.exports = Youtube.authenticate({
    type: 'oauth',
    client_id: credentials.web.client_id,
    client_secret: credentials.web.client_secret,
    redirect_url: credentials.web.redirect_uris[0]
});
