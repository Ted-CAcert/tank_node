const cam = require("./mycam.js");
const http = require('http');
const qs = require('querystring');
//const mover = require('./dummy.js');
const mover = require('./move.js');
const lights = require('./lights.js');
const servo = require('./servo.js');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    var url;
    var params;
    var Idx;

    res.statusCode = 200;
 
    console.log('Request Url: ' + req.url);
    Idx = req.url.indexOf('?');
    if (Idx >= 0) {
        url=req.url.slice(0, Idx);
        params=qs.parse(req.url.slice(Idx+1));
    } else {
        url=req.url;
        params = {};
    }
    if (url.match(/move\/forward$/)) {
        mover.moveTank("forward", params.range, params.speed);
    } else if (url.match(/move\/backward$/)) {
        mover.moveTank("backward", params.range, params.speed);
    } else if (url.match(/move\/left$/)) {
        mover.moveTank("left", params.range, params.speed);
    } else if (url.match(/move\/right$/)) {
        mover.moveTank("right", params.range, params.speed);
    } else if (url.match(/lights\/on$/)) {
        var duration;

        if (params.duration > 0) {
          duration = params.duration;
        } else {
          duration = 1;
        }

        if (params.color == "red") {
          lights.on(duration, [[255,0,0], [255,0,0], [255,0,0], [255,0,0], [255,0,0], [255,0,0]]);
        } else if (params.color == "green") {
          lights.on(duration, [[0,255,0], [0,255,0], [0,255,0], [0,255,0], [0,255,0], [0,255,0]]);
        } else if (params.color == "blue") {
          lights.on(duration, [[0,0,255], [0,0,255], [0,0,255], [0,0,255], [0,0,255], [0,0,255]]);
        } else {
          lights.on(duration);
        }
	cam.snap();
    } else if (url.match(/lights\/off$/)) {
        lights.off();
    } else if (url.match(/servo\/camera\/down$/)) {
        servo.setCameraTilt(0);
    } else if (url.match(/servo\/camera\/up$/)) {
        servo.setCameraTilt(100);
    } else if (url.match(/servo\/camera$/)) {
      servo.setCameraTilt(params.tilt);
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
  
