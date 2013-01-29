/*jshint node:true*/
var http = require('http');
module.exports.proxy = function(req, res, server, port){

    var options = {};

    options = {
        hostname: server,
        port: port,
        method: req.method,
        path: req.path,
        headers: {}
    };

    if ( req.headers['content-length'] ){
        options.headers['content-length'] = req.headers['content-length'];
    }

    if ( req.headers['content-type'] ){
        options.headers['content-type'] = req.headers['content-type'];
    }

    var callback = function(response) {

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

}