const http = require('http');
const qs = require('querystring');
const mover = require('./move.js');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
 
    console.log('Request Url: ' + req.url);
    if (req.url.match(/move\/forward$/)) {
        mover.moveTank("forward");
    } else if (req.url.match(/move\/backward$/)) {
        mover.moveTank("backward");
    } else if (req.url.match(/move\/left$/)) {
        mover.moveTank("left");
    } else if (req.url.match(/move\/right$/)) {
        mover.moveTank("right");
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
  
