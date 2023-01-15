const http = require('http');
const qs = require('querystring');
//const mover = require('./dummy.js');
const mover = require('./move.js');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    var url;
    var params;

    res.statusCode = 200;
 
    console.log('Request Url: ' + req.url);
    url=req.url.substr(0, req.url.indexOf('?'));
    params=qs.parse(req.url.slice(req.url.indexOf('?')+1));
    if (url.match(/move\/forward$/)) {
        mover.moveTank("forward", params.range, params.speed);
    } else if (url.match(/move\/backward$/)) {
        mover.moveTank("backward", params.range, params.speed);
    } else if (url.match(/move\/left$/)) {
        mover.moveTank("left", params.range, params.speed);
    } else if (url.match(/move\/right$/)) {
        mover.moveTank("right", params.range, params.speed);
    }
    if (req.method == "GET") {
        res.setHeader('Content-Type', 'text/html');
        res.end("<!DOCTYPE html>\r\n<html>\r\n<body>\r\n"+
          "<h1>OK</h1>\r\n"+
          "</body>\r\n</html>\r\n"
        );
    } else if (req.method == "POST") {
    }
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
  
