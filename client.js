window.addEventListener('load', function() {
    "use strict";

    var socket = io('http://localhost:3000'),
        button = document.querySelector('.fetch-image'),
        image = document.querySelector('.image');

    socket.on('connect', function() {
        console.log('connected');
        button.disabled = false;
    });

    socket.on('disconnect', function() {
        console.error('server disconnected');
        button.disabled = true;
    });

    socket.on('image', function(data) {
        console.log('got image');
        image.hidden = false;
        image.src = data;
    });

    button.addEventListener('click', function() {
        console.log('fetching');
        socket.emit('fetch-image');
    }, false);
});
