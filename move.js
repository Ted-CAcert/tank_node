const Gpio = require('pigpio').Gpio;
const cam = require('./mycam.js');

var pinA1 = new Gpio(14, {mode: Gpio.OUTPUT});
var pinA2 = new Gpio(15, {mode: Gpio.OUTPUT});
var pinA_EN = new Gpio(4, {mode: Gpio.OUTPUT});

var pinB1 = new Gpio(27, {mode: Gpio.OUTPUT});
var pinB2 = new Gpio(18, {mode: Gpio.OUTPUT});
var pinB_EN = new Gpio(17, {mode: Gpio.OUTPUT});

let inMove=0;

exports.moveTank=function (dir, range, speed)  {
    var PWMVal;
    var DefTimeout;

    if (inMove) return;

    if (dir == "forward") {
        pinA1.digitalWrite(1);
        pinA2.digitalWrite(0);
        pinB1.digitalWrite(0);
        pinB2.digitalWrite(1);
        DefTimeout = 1300;
    } else if (dir == "backward") {
        pinA1.digitalWrite(0);
        pinA2.digitalWrite(1);
        pinB1.digitalWrite(1);
        pinB2.digitalWrite(0);
        DefTimeout = 1300;
    } else if (dir == "left") {
        pinA1.digitalWrite(0);
        pinA2.digitalWrite(1);
        pinB1.digitalWrite(0);
        pinB2.digitalWrite(1);
        DefTimeout = 300;
    } else if (dir == "right") {
        pinA1.digitalWrite(1);
        pinA2.digitalWrite(0);
        pinB1.digitalWrite(1);
        pinB2.digitalWrite(0);
        DefTimeout = 300;
    } else {
        console.log("move.js: unknown direction "+dir);
        return;
    }

    inMove = 1;
    if (speed) {
        PWMVal = 75+180*(speed-1)/100;
        PWMVal = PWMVal.toFixed();
        if (PWMVal < 100) PWMVal = 100;
        if (PWMVal > 255) PWMVal = 255;
    } else {
        PWMVal = 255;
    }
    console.log("PWMVal: "+PWMVal);

    pinA_EN.analogWrite(PWMVal);
    pinB_EN.analogWrite(PWMVal);

    if (!range || range < 100 || range > 10000) {
        console.log("Default timeout "+DefTimeout);
        setTimeout(stopMovement, DefTimeout);
    } else {
        console.log("Timeout: "+range);
        setTimeout(stopMovement, range);
    }
}


function stopMovement() {
    inMove = 0;
    pinA1.digitalWrite(0);
    pinA2.digitalWrite(0);
    pinB1.digitalWrite(0);
    pinB2.digitalWrite(0);
    pinA_EN.digitalWrite(0);
    pinB_EN.digitalWrite(0);

    cam.snap();
}
