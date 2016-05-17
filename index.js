const http = require('http');

module.exports = function(inbound_request, inbound_response, server, port, path_to_strip) {
    const options = {
        hostname: server,
        port: port,
        method: inbound_request.method,
        path: inbound_request.url,
        headers: {},
    };

    if (path_to_strip && options.path.substring(0, path_to_strip.length) === path_to_strip) {
        options.path = options.path.substring(path_to_strip.length)
    }

    options.headers = inbound_request.headers;
    options.headers.host = server + ':' + port ;

    const outbound_request = http.request(options, (outbound_response) => {
        const headers = outbound_response.headers;

        if (headers['set-cookie']) {
            headers['set-cookie'] = headers['set-cookie'].map(cookie => cookie.replace(/; ?domain=[^;]*/ig, ''));
        }

        inbound_response.writeHead(outbound_response.statusCode, headers);

        outbound_response.on('data', chunk => inbound_response.write(chunk));
        outbound_response.on('end', () => inbound_response.end());
    });

    inbound_request.on('data', chunk => outbound_request.write(chunk));
    inbound_request.on('end', () => outbound_request.end());
};
