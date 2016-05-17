# Transparent Proxy Middleware

This is an extremely simple tool that is used to make development a little faster when working on web applications. The proxy allows you to access your static html through a node server and redirect your RESTful calls to the implementing server.

Basic example:

```js
const express = require('express');
const app = express();
const http = require('http');
const proxy = require('middleware-proxy');

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.static(__dirname + '/app'));
});

app.get('/service/*', function(req, res) {
    proxy(req,res, 'localhost', 8080);
});

app.post('/service/*', function(req, res) {
    proxy(req,res, 'localhost', 8080);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
```

This will send all get and post requests with paths starting with `/service` to `http://localhost:8080`.
