var express = require('express'),
    Renderer = require('./renderer.js'),
    renderer = new Renderer(),
    ViralContainer = require('../src/viral-container.js'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/viraljs-demo');

var connectionSchema = mongoose.Schema({
    data: String
});

var Connection = mongoose.model('Connection', connectionSchema);

var express = require('express');
var app = express();
var viralContainer = new ViralContainer();

var connections = {};

function isAlreadyThere(connectionData) {

    for (var i = 0; i < Object.keys(connections).length; i++) {
        var connectionKey = Object.keys(connections)[i],
            connectionToCheck = connections[connectionKey];

        if (connectionToCheck.a.name === connectionData.a.name && connectionToCheck.b.name === connectionData.b.name) {
            return true;
        }
    }

    return false;
}

function addConnectionToDB(connectionData) {
    var data = JSON.stringify(connectionData);
    var connection = new Connection({data: data});
    connection.save();
}

Connection.find().exec(function (error, response) {
    response.forEach(function (connection) {
        connections[Math.random()] = JSON.parse(connection.data);
    });

    viralContainer.socket.on('connection', function (socket) {
        socket.on('addConnection', function (msg) {
            if (!isAlreadyThere(msg)) {
                console.log('Adding connection ' + msg.a.name + ' to ' + msg.b.name);
                connections[socket.id] = msg;
                addConnectionToDB(msg);
            }

            console.log('Sending connections to ' + socket.id);
            viralContainer.socket.emit('connectionsGraph', connections);
        });
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
});