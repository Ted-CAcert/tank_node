/* Tried using "adafruit-pca9685" initially, but did not get it installed 
   on the pi (node version 19.5.0), as "i2c" did not install (maybe a problem 
   with node-gyp?).
   Since I'm better in I2C than fixinig broken node installers, I found
   "i2c-bus", which installs without complains on the pi, and did the I2C
   communication myself...

   See datasheet at https://cdn-shop.adafruit.com/datasheets/PCA9685.pdf
*/ 

const i2c = require('i2c-bus');
const cam = require('./mycam.js');

var i2cAddr  = 0x40; // I2C address of the PCA9685 in the raspi tank
var busNo = 1; // 1 is the bus number of the I2C bus on the raspi tank

/* For servo control you'll usually set onValue to 0.
   offValue takes values from 0 to 4095 (0x3FF), but your servos may not accept
   the full scale. Some experimenting may be needed to find sensible lower and
   upper bounds...
*/
function set_pwm(chan, onValue, offValue) {
    var buf;

    if (chan < 0 || chan > 15) {
        // OK, there are probably more sensible ways in Node to do this...
        return;
    }
    if (onValue < 0 || onValue > 4095 ||
        offValue < 0 || offValue > 4095 ||
        offValue < onValue) {
        // Keep it sensible...
        return;
    }
    if (onValue == undefined) onValue=0;
    if (offValue == undefined) offValue = onValue;

    const i2c1 = i2c.openSync(busNo); 

    // Each channel has 4 byte registers starting at register#6
    var registerNo = 6+4*chan; 

    buf = Buffer.alloc(5);
    buf.writeUInt8(registerNo, 0); // Starting register
    buf.writeUInt16LE(onValue, 1);
    buf.writeUInt16LE(offValue, 3);
//    console.log(buf);
    i2c1.i2cWriteSync(i2cAddr, 5, buf);

    i2c1.closeSync();
}

function get_pwm(chan) {
    var res = {};
    var buf;

    if (chan < 0 || chan > 15) {
        // OK, there are probably more sensible ways in Node to do this...
        return;
    }

    const i2c1 = i2c.openSync(busNo); 

    // Each channel has 4 byte registers starting at register#6
    var registerNo = 6+4*chan; 

    buf = Buffer.alloc(1);
    buf.writeUInt8(registerNo);
    i2c1.i2cWriteSync(i2cAddr, 1, buf);

    buf = Buffer.alloc(4);
    i2c1.i2cReadSync(i2cAddr, 4, buf);
    res.onValue = buf.readInt16LE(0);
    res.offValue = buf.readInt16LE(2);

    i2c1.closeSync();

    return res;
}



// My camera panel
// Lower position: 0x140
// Upper position: 0x0C0
const CHANNEL_CAMERA = 11; // Servo used to tilt camera
var curCameraVal = 0x140; // Init to lower positon
var targetCameraVal = 0x140;
var moveInterval;

/* It's not nice if servos jerk arund, so let's slow them down a bit... */
function moveFunc() {
    if (curCameraVal == targetCameraVal) {
        // We're already there, stop intervall
    }
//    console.log("cur: "+curCameraVal+", target: "+targetCameraVal);

    if (Math.abs(targetCameraVal - curCameraVal) <= 0x12) { // Last step may be a bit bigger or smaller
        curCameraVal = targetCameraVal;
        if (moveInterval) {
            clearInterval(moveInterval);
            moveInterval = undefined;
            cam.snap();
        }
    } else if (curCameraVal < targetCameraVal) {
        curCameraVal += 0x08;
    } else {
        curCameraVal -= 0x08;
    }
    set_pwm(CHANNEL_CAMERA, 0, curCameraVal)
}

// tiltPos is from 0 (lower pos) to 100 (upper pos)
exports.setCameraTilt=function (tiltPos)  {
    if (tiltPos < 0) tiltPos = 0;
    if (tiltPos > 100) tiltPos = 100;

    targetCameraVal = (0x140 - (0x70*tiltPos/100));
    if (!moveInterval) {
        // Increase delay to reduce speed
        // Sending a new position over I2C may need up to 1 ms if standard
        // mode is used for I2C, so very low delay values may have unexpected
        // results
        moveInterval = setInterval(moveFunc, 25);
    }
}

function init() {
    const i2c1 = i2c.openSync(busNo); 

    // Set PWM frequency to 50Hz, see https://cdn-shop.adafruit.com/datasheets/PCA9685.pdf#page=25
    var prescaleval = 25000000; // 25 MHz internal oscillator frequency
    prescaleval /= 4096; // 12-bit counter
    prescaleval /= 50; // 50 Hz target
    prescaleval--;
    prescaleval = Math.round(prescaleval);
    console.log("Prescaler value: "+prescaleval);

    // Prescaler register can only be written in sleep mode, so go to sleep...
    buf = Buffer.from([0x00]); // MODE1
    i2c1.i2cWriteSync(i2cAddr, 1, buf);

    buf = Buffer.alloc(1);
    i2c1.i2cReadSync(i2cAddr, 1, buf);
    var oldmode = buf.readUInt8(0);
    console.log("Old mode 0x"+oldmode.toString(16));
    var newmode = (oldmode & 0x7F) | 0x10;    // sleep

    buf = Buffer.from([0x00, newmode]); // Write new mode to MODE1
    i2c1.i2cWriteSync(i2cAddr, 2, buf); 

    buf = Buffer.from([0xFE, prescaleval]); // Write prescaler value to PRE_SCALE register
    i2c1.i2cWriteSync(i2cAddr, 2, buf); 
    
    oldmode &= 0xEF; // Make sure sleep bit is cleared
    // Since we are at it, also set the AI bit we need 
    oldmode |= 0x20;
    buf = Buffer.from([0x00, oldmode]); // Set mode
    i2c1.i2cWriteSync(i2cAddr, 2, buf); 

    
    set_pwm(CHANNEL_CAMERA, 0, curCameraVal);
}
//console.log(get_pwm(CHANNEL_CAMERA));
init();
