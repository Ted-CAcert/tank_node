// Test with onoff library. Not useful since it does not seem to support PWM

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var pin1 = new Gpio(14, 'out'); //use GPIO pin 4, and specify that it is output
var pin2 = new Gpio(15, 'out'); //use GPIO pin 4, and specify that it is output
var pinEN = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 2000); //run the blinkLED function every 2000ms

function blinkLED() { //function to start blinking
  if (pin1.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    pin1.writeSync(1); //set pin state to 1 (turn LED on)
    pin2.writeSync(0); //set pin state to 1 (turn LED on)
    pinEN.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    pin1.writeSync(0); //set pin state to 1 (turn LED on)
    pin2.writeSync(1); //set pin state to 1 (turn LED on)
    pinEN.writeSync(1); //set pin state to 1 (turn LED on)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  pin1.writeSync(0); //set pin state to 1 (turn LED on)
  pin2.writeSync(0); //set pin state to 1 (turn LED on)
  pinEN.writeSync(0); //set pin state to 1 (turn LED on)
  pin1.unexport(); // Unexport GPIO to free resources
  pin2.unexport(); // Unexport GPIO to free resources
  pinEN.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 10000); //stop blinking after 10 seconds 
