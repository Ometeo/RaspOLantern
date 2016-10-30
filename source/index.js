/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 Jonathan Bihet
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var app     = require('express')();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var Gpio    = require('pigpio').Gpio,
    led18   = new Gpio(16, {mode: Gpio.OUTPUT}),
    dutyCycle = 0;

var Sound   = require('node-aplay');

var increment = 5;

var idleAnimation = function(){
    dutyCycle = randomInt(0, 256);

    led18.pwmWrite(dutyCycle);  
};


var on = true;
var evilLaughAnimation = function(){
    if(on){
      console.log("on");
      led18.pwmWrite(255);
    } else {
      console.log("off");
      led18.pwmWrite(0);
    }
    on = !on;
};

/**
 * function to get the main page of the application
 */
app.get('/', function(req, res){
    console.log("Get main page - Start application");
   res.sendFile(__dirname + '/index.html'); 
});

/**
 * Socket connection.
 */
io.on('connection', function(socket){
    console.log("Socket connection.");

    /**
     * Activate command.
     */
    socket.on('activateCommand', function(){
        console.log("Command executed.");
        new Sound(__dirname +'/Evil_Laugh.wav').play();
        clearInterval(idle);
        laugh = setInterval(evilLaughAnimation, 200);
        setTimeout(function(){
            console.log("here");
            clearInterval(laugh);
            idle = setInterval(idleAnimation, 100);
        }, 4000);
    });
});

var idle = setInterval(idleAnimation, 100);

/**
 * Start the server
 */
http.listen(8080, function(){
    console.log("Start Server...");
})

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}