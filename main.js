var config = {
    sendImageInterval: 250,
    imagesDirectory: 'images',
    port: 3000
};

if(process.argv[2] && process.argv[2] === 'prod')
    config.port = process.env.PORT;

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    fetchImages = require('./fetchFiles.js');

var sockets = [],
    interval,
    images = [];

io.on('connection', function(socket) {
    console.log('new connection');
    sockets.push(socket);

    socket.on('fetch-image', function() {
        console.log('sending image');
        fs.readFile(__dirname + '/image.png', function(err, data) {
            if(err)
                return;

            console.log('image sent');
            socket.emit('image', 'data:image/png;base64,' + data.toString('base64'));
        });
    });

    socket.on('disconnect', function() {
        console.log('disconnected');
        sockets.filter(function(currSocket) {
            return socket !== currSocket;
        });
    });
});

fetchImages(config.imagesDirectory).then(function (files) {
    images = files;
    http.listen(config.port, function(err) {
        if(err)
            return console.error('Cannot start server');

        console.log('Listening on port 3000');

        // Read directory
        var sendingFactory = sendImageFactory();
        interval = setInterval(sendingFactory, config.sendImageInterval);
    });

}, function (error) {
    console.error('Cannot start the server', error);
});

function sendImageFactory() {
    var i = 0;

    return function() {
        if(sockets.length == 0)
            return;

        fs.readFile(__dirname + '/' + config.imagesDirectory + '/' + images[i], function(err, data) {
            if(err) {
                console.error('Cannot read file: ', config.imagesDirectory + '/' + images[i]);
                return;
            }

            var fileType = images[i].split('.').pop();
            var toSend = 'data:image/' + fileType + ';base64,' + data.toString('base64');

            console.log('Sending image ', config.imagesDirectory + '/' + images[i]);

            sockets.forEach(function(socket) {
                socket.emit('image', toSend);
                console.log('sent');
            });

            i++;

            if(i == images.length)
                i = 0;
        });
    };
}