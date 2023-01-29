/* Tried using "adafruit-pca9685" initially, but did not get it installed 
   on the pi (node version 19.5.0), as "i2c" did not install (maybe a problem 
   with node-gyp?).
   Since I'm better in I2C than fixinig broken node installers, I found
   "i2c-bus", which installs without complains on the pi, and did the I2C
   communication myself...

   See datasheet at https://cdn-shop.adafruit.com/datasheets/PCA9685.pdf
*/ 

const i2c = require('i2c-bus');

var i2cAddr  = 0x40; // I2C address of the PCA9685 in the raspi tank
const CHANNEL_CAMMERA = 11; // Servo used to 

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

    const i2c1 = i2c.openSync(1); // 1 is the bus number of the I2C bus on the raspi tank

    // Make sure MODE1 register is sensible. Important flags:
    // AI (Bit 5) is on, this code relies on it
    // SLEEP (Bit 4) is off, otherwise the chip won't control anything
    // Other bits use default setting from the data sheet.
    buf = Buffer.from([0x00, 0x21]); // First the register#, then the value(s)
    i2c1.i2cWriteSync(i2cAddr, 2, buf);

    // Each channel has 4 byte registers starting at register#6
    var registerNo = 6+4*chan; 

    buf = Buffer.alloc(5);
    buf.writeUInt8(registerNo, 0); // Starting register
    buf.writeUInt16LE(onValue, 1);
    buf.writeUInt16LE(offValue, 3);
    console.log(buf);
    i2c1.i2cWriteSync(i2cAddr, 5, buf);

    i2c1.closeSync();
}

// Camera panel:
// Ruhezustand: 0x12b
// ganz oben: 0x0C0
// ganz unten: 0x14B

