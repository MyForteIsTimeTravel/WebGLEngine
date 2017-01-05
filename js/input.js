// example: https://github.com/luser/gamepadtest

var gamepads = {};

function handleGamepad (event, connecting) {
    var gamepad = event.gamepad;
    
    if (connecting) {
        gamepads[gamepad.index] = gamepad;
    } else {
        delete gamepad[gamepad.index];
    }
}

function pollGamepads () {
    var controller = gamepads[0];
    
    if (typeof(controller) == "object") {
        console.log("button pressed");
    }
}

// listeners
window.addEventListener("gamepadconnected", function (e) {
    console.log("gamepad connected");
    handleGamepad(e, true);
}, false);

window.addEventListener("gamepaddisconnected", function (e) {
    console.log("gamepad disconnected");
    handleGamepad(e, false);
}, false);