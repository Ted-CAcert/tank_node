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
          handleKey5(true);
        } else if (i == 6) {
          handleKey6(true);
        } else if (i == 7) {
          handleKey7(true)
        }
      } else {
        if (i == 5) {
          handleKey5(false);
        } else if (i == 6) {
          handleKey6(false);
        } else if (i == 7) {
          handleKey7(false)
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
        setTankSpeed(val);
      }
      if (i == 0 && val) {
        setTankRot(val);
      }
      if (i == 7 && val) {
        setTankBack(val);
      }
    }
  }
  if (!editAddr) editAddr=document.getElementById("address");
  setTimeout(updateStatus, 200);
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
    xhttp.open("GET", "http://"+editAddr.value+"/move/forward?range=250&speed="+CurSpeed.toFixed());
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
      CurSpeed=-75*(val+0.3)/0.7;
    } else {
      Direction="right";
      CurSpeed=75*(val-0.3)/0.7;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://"+editAddr.value+"/move/"+Direction+"?range=250&speed="+CurSpeed.toFixed());
    xhttp.send();
  }
}

var LastBack;
function setTankBack(val) {
  var CurSpeed;
  
  if (!editAddr) editAddr=document.getElementById("address");
  if (val < 0.5) {
    CurSpeed = 0;
  } else {
    CurSpeed = 50;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://"+editAddr.value+"/move/backward?range=250&speed="+CurSpeed.toFixed());
    xhttp.send();
  }
}


var LastBut5;
function handleKey5(key) {
  if (key && !LastBut5) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../control/lights/on?duration=1");
    xhttp.send();
    
    LastBut5 = true;
    
  }
  if (!key) {
  LastBut5 = false;
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
