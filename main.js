var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs');

io.on('connection', function(socket) {
    console.log('new connection');

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
    })
});


http.listen(3000, function() {
    console.log('Listening on port 3000');
});
