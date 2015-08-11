/*jshint node:true*/
var http = require('http');
module.exports.proxy = function(req, res, server, port, pathToStrip){

    var options = {};

    options = {
        hostname: server,
        port: port,
        method: req.method,
        path: req.url,
        headers: {}
    };

    if (pathToStrip && options.path.substring(0, pathToStrip.length) === pathToStrip) {
        options.path = options.path.substring(pathToStrip.length);
    }

    options.headers = req.headers;

    var callback = function(response) {

        if (response.headers['set-cookie']) {
            response.headers['set-cookie'] = response.headers['set-cookie'].map(function (cookie) {
                return cookie.replace(/; ?domain=[^;]*/ig, '');
            });
        }

        res.writeHead(response.statusCode, response.headers);
        response.on('data', function (chunk) {
            res.write(chunk);
        });
        response.on('end', function() {
            res.end();
        });

    };

    var request = http.request(options, callback);
    req.on('data', function (chunk) {
        request.write(chunk);
    });
    req.on('end', function() {
        request.end();
    });

};
