const express = require('express');
const cors = require('cors');
const oauth = require('./oauth');
const http = require('axios');
const querystring = require('querystring');
const server = express();
const port = 8081;

// Enable CORS headers
server.use(cors());

// Enable handling of "application/json" requests
server.use(express.json());

// Create the route for the "token" operation
server.post('/api/token', (req, res) => {

    // Create the token exchange request body
    const authRequest = querystring.stringify({
        grant_type: 'authorization_code',
        client_id: oauth.clientId,
        client_secret: oauth.secret,
        code: req.body.authCode,
        scope: 'lp'
    });

    // The options for the HTTP POST request to the IdP endpoint
    let authOptions = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    // The URL of the IdP server
    const idpUri = `https://${oauth.host}/oauth2/v1/token`;

    // Send the request and receive back the auth code
    http.post(idpUri, authRequest, authOptions)
        .then((idpResp) => {
            // Forward the response from the IdP back to the caller
            res.status(200).send(idpResp.data);
        })
        .catch((err) => {
            console.log(err);
            res.status(403).send({ message: 'Failed to generate access token' });
        });
});

// A health check endpoint
server.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK' });
});

server.listen(port, () => console.log(`Token Exchange Service listening on port ${port}...`));
