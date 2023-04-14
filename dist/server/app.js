"use strict";
var WebSocketClient = require("websocket").client;
var client = new WebSocketClient();
client.on("connectFailed", function (error) {
    console.log("Connect Error: " + error.toString());
});
client.on("connect", function (connection) {
    const readline = require("readline");
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    process.stdin.on("keypress", (str, key) => {
        if (key.ctrl && key.name === "c") {
            process.exit(0);
        }
        if (key.name === "up") {
            connection.sendUTF("up");
            console.log("coffee status: " + true);
        }
        if (key.name === "down") {
            connection.sendUTF("down");
            console.log("coffee status: " + false);
        }
    });
    console.log("WebSocket Client Connected");
    connection.on("error", function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on("close", function () {
        console.log("echo-protocol Connection Closed");
    });
    connection.on("message", function (message) {
        if (message.type === "utf8") {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xffffff);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});
client.connect("ws://144.24.199.103:8999", "echo-protocol");
//# sourceMappingURL=app.js.map