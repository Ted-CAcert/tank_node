const ws281x = require('rpi-ws281x-native');
const cam = require("./mycam.js");

const channel = ws281x(6, { gpio: 12, stripType: 'ws2812' });
const colorsArray = channel.array;

let lightTimeout;
let blinkInterval;
let isOn=false;
let BlinkState = 0;

/*  color is an array of RGB values, one for each LED 
    duration is in minutes, -1 for "no timeout"
*/
exports.on=function (duration, color) {
    for (let i = 0; i < channel.count; i++) {
        if (color && color.length && i < color.length && color[i].length == 3) {
            colorsArray[i] = color[i][0]*0x10000+color[i][1]*0x100+color[i][2]
        } else {
            colorsArray[i] = 0xffffff;
        }
    }
    ws281x.render();

    if (!duration) {
        if (lightTimeout) clearTimeout(lightTimeout);
        lightTimeout = setTimeout(this.off, 60000, this);
    } else if (duration > 0) {
        if (lightTimeout) clearTimeout(lightTimeout);
        lightTimeout = setTimeout(this.off, duration*60000, this);
    }
    cam.snap();

    isOn=true;
}

exports.off=function (obj) {
    if (lightTimeout) clearTimeout(lightTimeout);

    BlinkState = 0;
    if (obj) {
      obj.on(-1, [ [1,0,0], [0,0,0], [0,0,0], [0,1,0], [0,0,0], [0,0,0] ]);
    } else {
      this.on(-1, [ [1,0,0], [0,0,0], [0,0,0], [0,1,0], [0,0,0], [0,0,0] ]);
    }
    isOn=false;
}

function timerBlink(obj) {
    if (isOn) return;

    if (BlinkState == 0) {
        if (obj) {
            obj.on(-1, [ [1,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ]);
        } else {
            this.on(-1, [ [1,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ]);
        }
        BlinkState=1;
    } else {
        if (obj) {
            obj.on(-1, [ [0,0,0], [0,0,0], [0,0,0], [0,1,0], [0,0,0], [0,0,0] ]);
        } else {
            this.on(-1, [ [0,0,0], [0,0,0], [0,0,0], [0,1,0], [0,0,0], [0,0,0] ]);
        }
        BlinkState=0;
    }
}

blinkInterval = setInterval(timerBlink, 1000, null);
