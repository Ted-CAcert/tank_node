const ws281x = require('rpi-ws281x-native');

const channel = ws281x(6, { gpio: 12, stripType: 'ws2812' });

let lightTimeout;

/*  color is an array of RGB values, one for each LED 
    duration is in minutes, -1 for "no timeout"
*/
exports.set=function (onoff, duration, color) {
    if (!onoff) lights_off();
  
    for (let i = 0; i < channel.count; i++) {
        if (color && color.length && i < color.length && color[i].length == 3) {
            colorsArray[i] = color[i][0]*0xffff+color[i][1]*0xff+color[i][2]
        } else {
            colorsArray[i] = 0xffffff;
        }
    }
    ws281x.render();

    if (!duration) {
        if (lightTimeout) clearTimeout(lightTimeout);
        lightTimeout = setTimeout(lights_off, 60000);
    } else if (duration > 0) {
        if (lightTimeout) clearTimeout(lightTimeout);
        lightTimeout = setTimeout(lights_off, duration*60000);
    }
}

function lights_off() {
    if (lightTimeout) clearTimeout(lightTimeout);
  
    this.set(1, -1, [ [1,0,0], [0,0,0], [0,0,0], [0,1,0], [0,0,0], [0,0,0] ]);
}