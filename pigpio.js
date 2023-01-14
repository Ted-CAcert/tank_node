// Tests with pigpi library

// Bei voller Batterie fängt die Kette (freilaufend) bei ca. 60/255 an zu laufen,
// ab 100/255 läuft sie auch bei schwacher Batterie zuverlässig

const Gpio = require('pigpio').Gpio;


var pin1 = new Gpio(14, {mode: Gpio.OUTPUT});
var pin2 = new Gpio(15, {mode: Gpio.OUTPUT});
var pinEN = new Gpio(4, {mode: Gpio.OUTPUT});

let dutyCycle = 0;

pin1.digitalWrite(1);
pin2.digitalWrite(0);
pinEN.pwmWrite(0);

var myInterval=setInterval(control, 1000);

function control() {
  dutyCycle += 5;
  if (dutyCycle > 255) {
    dutyCycle = 0;
  }
  console.log("DC: "+dutyCycle);
  pinEN.pwmWrite(dutyCycle);
}

function end() {
  clearInterval(myInterval); // Stop interval
  pin1.digitalWrite(0);
  pin2.digitalWrite(0);
  pinEN.digitalWrite(0);
}

setTimeout(end, 60000);
