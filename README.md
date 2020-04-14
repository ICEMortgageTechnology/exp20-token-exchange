# Token Exchange Service (NodeJS)
This service provides a reference implementation for a Token Exchange service
that can be used with a Custom Tool or Plugin inside one of Ellie Mae's
web-based applications (LO Connect, TPO Connect). Token Exchange allows a
customization to obtain an API Access Token that can be used to invoke
the Ellie Mae REST APIs.

## Installation
To install the Token Exchange Service, download the source code to a local
folder and run:

```
npm install
```

You must have NodeJS installed and the `npm` package manager executable in your
path.

## Configuration
Before you can run the tool, you must configure it by creating a file named
`oauth.js` in the root folder of the application. This file should contain the
following contents:

```javascript
module.exports = {
   host: "<api_hostname>",   // e.g. api.elliemae.com
   clientId: "<oauth_cid>",
   secret: "<oauth_secret>"
}
```

The OAuth Client ID and Secret must correspond to a valid Encompass instance for the environment
referenced by the `api_hostname`.

## Running the Service
Once the configuration file is created, you can run the service by executing the following:

```
node tokensvc.js
```

The service is configured to run on port 8081, and you can test the service by querying the /health
endpoint of the service:

```
GET http://localhost:8081/health
```

The service should respond with the following JSON object:

```javascript
{ "status": "OK" }
```

## Invoking the Service
To invoke the service in your custom code, you can call perform a token exchange as follows:

```javascript
    const http = await elli.script.getObject('http');
    const auth = await elli.script.getObject('auth');

    // Generate an auth code from the host application
    let authCode = await auth.createAuthCode();

    // Invoke the token excahnge API
    let tokenResp = await http.post('http://localhost:8081/api/token', 
        { "Content-Type": "application/json" }, 
        { authCode: authCode }
    );

    if (tokenResp.status != 200) {
        throw "Unable to perform token exchange";
    }

    // Extract the access token from the response
    accessToken = tokenResp.body.access_token;
```

You can now use this `accessToken` to invoke Encompass APIs.