/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 * Extended by <ted@convey.de> as controller for adeept rasptank 
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */
var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
let ForwardAxis = { func: "forward" };
let LeftAxis = { func: "left" };
let RightAxis = { func: "right" };
let BackwardAxis = { func: "back" };
let LightOnBut = { func: "lighton" };
let LightOffBut = { func: "lightoff" };
const ControllerSetup = [ ForwardAxis, LeftAxis, RightAxis, BackwardAxis, LightOnBut, LightOffBut ];

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i=0; i<gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);
  var a = document.createElement("div");
  a.className = "axes";
  for (i=0; i<gamepad.axes.length; i++) {
    e = document.createElement("meter");
    e.className = "axis";
    //e.id = "a" + i;
    e.setAttribute("min", "-1");
    e.setAttribute("max", "1");
    e.setAttribute("value", "0");
    e.innerHTML = i;
    a.appendChild(e);
  }
  d.appendChild(a);
  document.getElementById("start").style.display = "none";
  document.body.appendChild(d);
  setTimeout(updateStatus);

  if (gamepad.id.includes("Xbox One Controller")) {
    ForwardAxis.type="axis_full"; // idle position is -1, max value 1
    ForwardAxis.idx=5;
    RightAxis.type="axis_pos"; // idle position is 0, max. value 1, only positive values are relevant
    RightAxis.idx=0;
    LeftAxis.type="axis_neg"; // idle position is 0, max value -1, only negative values are relevant
    LeftAxis.idx=0;
    BackwardAxis.type="button";
    BackwardAxis.idx=5;

    LightOnBut.type="button";
    LightOnBut.idx=4;
    LightOffBut.type="button";
    LightOffBut.idx=13;
  } else {
    ForwardAxis.type="axis_neg"; // idle position is 0, max. value 1, only positive values are relevant
    ForwardAxis.idx=1;
    BackwardAxis.type="axis_pos"; // idle position is 0, max value -1, only negative values are relevant
    BackwardAxis.idx=1;
    RightAxis.type="axis_pos"; // idle position is 0, max. value 1, only positive values are relevant
    RightAxis.idx=0;
    LeftAxis.type="axis_neg"; // idle position is 0, max value -1, only negative values are relevant
    LeftAxis.idx=0;

    LightOnBut.type="button";
    LightOnBut.idx=4;
    LightOffBut.type="button";
    LightOffBut.idx=6;
  }
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");
    for (var i=0; i<controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      var touched = false;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        if ('touched' in val) {
          touched = val.touched;
        }
        val = val.value;;
      }
      var pct = Math.round(val * 100) + "%";
      b.style.backgroundSize = pct + " " + pct;
      b.className = "button";
      if (pressed) {
        b.className += " pressed";
        if (i == 5) {
//          handleKey5(true);
        } else if (i == 6) {
//          handleKey6(true);
        } else if (i == 7) {
//          handleKey7(true)
        }
      } else {
        if (i == 5) {
//          handleKey5(false);
        } else if (i == 6) {
//          handleKey6(false);
        } else if (i == 7) {
//          handleKey7(false)
        }
      }
      if (touched) {
        b.className += " touched";
      }
    }

    var axes = d.getElementsByClassName("axis");
    for (var i=0; i<controller.axes.length; i++) {
      var a = axes[i];
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i]);
      
      val = controller.axes[i];
      if (i == 5 && val) {
        val++;
//        setTankSpeed(val);
      }
      if (i == 0 && val) {
//        setTankRot(val);
      }
      if (i == 7 && val) {
//        setTankBack(val);
      }
    }

    // Handle tank actions
    handleActions(controller.axes, controller.buttons);
  }
  if (!editAddr) editAddr=document.getElementById("address");
  setTimeout(updateStatus, 200);
}

function handleActions(axes, buttons) {
    ControllerSetup.forEach((cfg) => {
      if (cfg.type.includes("axis")) {
        val = axes[cfg.idx];
        // Convert to a range between 0 for idle and 1 for full
        if (cfg.type === "axis_full") {
          // if the axis has never been touched it usually starts at 0 ==> wait till it is (almost) -1 once
          if (val < -0.9) {
            cfg.isinit = true;
          }
          if (cfg.isinit) {
            val = (val + 1)/2;
          } else  {
            val = 0;
          }
        } else if (cfg.type === "axis_pos") {
          if (val <= 0) {
            val = 0;
          }
          // Nothing to do otherwise
        } else if (cfg.type === "axis_neg") {
          if (val >= 0) {
            val = 0;
          } else {
            val = -1*val;
          }
        } else {
          console.log("Unknown axis type "+cfg.axis);
          val = 0; // prevents anything from happening
        }
      } else if (cfg.type === "button") {
        val = buttons[cfg.idx];
        if (typeof(val) == "object") {
          if (val.pressed || val.touched) {
            val = 1;
          } else {
            val = 0;
          }
        } else {
          val = 0;
        } 
      } else {
        console.log("Unknown setup type "+cfg.type);
      }
      // now val contains a number between 0 and 1 (including)
      switch(cfg.func) {
        case "forward":
          setTankSpeed(val);
          break;

        case "back":
          setTankBack(val);
          break;

        case "left":
          setTankRot(-1*val);
          break;

        case "right":
          setTankRot(val);
          break;

        case "lighton":
          lightOn(val);
          break;

        case "lightoff":
          break;

        defaut:
          console.log("Unknown function "+cfg.func);
      }
    });
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

var editAddr;

var LastSpeed;
function setTankSpeed(val) {
  var CurSpeed;
  
  if (!editAddr) editAddr=document.getElementById("address");
  if (val < 0.01) {
    CurSpeed = 0;
  } else {
    CurSpeed = 100*val/2;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", editAddr.value+"/move/forward?range=250&speed="+CurSpeed.toFixed());
    xhttp.send();
  }
}

var LastRot;
function setTankRot(val) {
  var CurSpeed;
  var Direction;
  
  if (!editAddr) editAddr=document.getElementById("address");
  if (val > -0.3 && val < 0.3) {
    CurSpeed = 0;
  } else {
    if (val < 0) {
      Direction="left";
      CurSpeed=-50*(val+0.3)/0.7;
    } else {
      Direction="right";
      CurSpeed=50*(val-0.3)/0.7;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", editAddr.value+"/move/"+Direction+"?range=250&speed="+CurSpeed.toFixed());
    xhttp.send();
  }
}

var LastBack;
function setTankBack(val) {
  var CurSpeed;
  
  if (!editAddr) editAddr=document.getElementById("address");
  if (val < 0.2) {
    CurSpeed = 0;
  } else {
    CurSpeed = 50*val;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", editAddr.value+"/move/backward?range=250&speed="+CurSpeed.toFixed());
    xhttp.send();
  }
}


var LastLightOn;
function lightOn(val) {
  if (val > 0.5 && !LastLightOn) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../control/lights/on?duration=1");
    xhttp.send();
    
    LastLightOn = true;
    
  }
  if (val <= 0.5) {
    LastLightOn = false;
  }
}

var LastBut6;
function handleKey6(key) {
  if (key && !LastBut6) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../control/servo/camera/down");
    xhttp.send();
    
    LastBut6 = true;
    
  }
  if (!key) {
  LastBut6 = false;
  }
}

var LastBut7;
function handleKey7(key) {
  if (key && !LastBut7) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../control/servo/camera/up");
    xhttp.send();
    
    LastBut7 = true;
    
  }
  if (!key) {
  LastBut7 = false;
  }
}


if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}
