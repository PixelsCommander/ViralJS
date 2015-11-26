var express = require('express'),
    Renderer = require('./renderer.js'),
    renderer = new Renderer(),
    ViralContainer = require('../src/viral-container.js');

var express = require('express');
var app = express();
var viralContainer = new ViralContainer();

var connections = {};


viralContainer.socket.on('connection', function(socket){
    socket.on('addConnection', function(msg){
        connections[socket.id] = msg;
        console.log('Sending connections to ' + socket.id);
        socket.emit('connectionsGraph', connections);
    });
    /*socket.on('disconnect', function(msg){
        delete(connections[socket.id]);
        console.log('Sending connections to ' + socket.id);
    });*/
});

app.use(viralContainer.middleware);

app.get('/', function (req, res) {
    res.header('Content-Type', 'text/html');
    res.send(renderer.render() + '<script> window.connections = ' + JSON.stringify(connections) + '</script>');
});

app.use(express.static('./'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});