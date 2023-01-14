const Gpio = require('pigpio').Gpio;

var pinA1 = new Gpio(14, {mode: Gpio.OUTPUT});
var pinA2 = new Gpio(15, {mode: Gpio.OUTPUT});
var pinA_EN = new Gpio(4, {mode: Gpio.OUTPUT});

var pinB1 = new Gpio(27, {mode: Gpio.OUTPUT});
var pinB2 = new Gpio(18, {mode: Gpio.OUTPUT});
var pinB_EN = new Gpio(17, {mode: Gpio.OUTPUT});

let inMove=0;

exports.moveTank=function (dir, range, speed)  {
    var PWMVal;

    if (inMove) return;

    if (dir == "forward") {
        pinA1.digitalWrite(1);
        pinA2.digitalWrite(0);
        pinB1.digitalWrite(1);
        pinB2.digitalWrite(0);
    } else if (dir == "backward") {
        pinA1.digitalWrite(0);
        pinA2.digitalWrite(1);
        pinB1.digitalWrite(0);
        pinB2.digitalWrite(1);
    } else {
        console.log("move.js: unknown direction "+dir);
        return;
    }

    inMove = 1;
    if (speed) {
        PWMVal = 100+155*100/speed;
        if (PWMVal < 100) PWMVal = 100;
        if (PWMVal > 255) PWMVal = 255;
    } else {
        PWMVal = 255;
    }
    pinA_EN.analogWrite(PWMVal);
    pinB_EN.analogWrite(PWMVal);

    if (range < 100 || range > 10000) {
        setTimeout(stopMovement, 1300);
    } else {
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
}