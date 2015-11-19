'use strict';

var http = require('http'),
    p2p = require('socket.io-p2p-server'),
    socketio = require('socket.io'),
    ViralThinClient = require('./viral-thin-client.js'),
    ViralClientAddition = require('./viral-client-addition.js'),
    inline = require('inline-source'),
    fs = require('fs'),
    path = require('path'),
    useragent = require('express-useragent');

var browsersAllowed = {
    'chrome': true,
    'firefox': true,
    'safari': false,
    'edge': false,
    'ie': false
};

var ICEPort = 7000;

class ViralContainer {
    constructor() {
        this.server = http.createServer();
        this.p2pserver = p2p.Server;
        this.socket = socketio(this.server);
        this.socket.use(this.p2pserver);
        this.peers = [];

        this.socket.on('connection', this.onConnection.bind(this));

        this.server.listen(ICEPort, function () {
            console.log("Viral container socket is listening on " + ICEPort);
        });

        this.middleware = this.middleware.bind(this);
    }

    onConnection(socket) {
        console.log('Connected #' + this.peers.length + ', ID ' + socket.id + ', adress ' + socket.request.connection.remoteAddress);
        //socket.join(socket.id);
        this.peers.push(socket);
        socket.on('disconnect', this.onDisconnection.bind(this, socket));
        socket.on('error', this.onDisconnection.bind(this, socket));
    }

    onDisconnection(socket) {
        var peerIndex = this.peers.indexOf(socket);

        console.log('Disconnected ' + peerIndex);

        if (peerIndex !== -1) {
            this.peers.splice(peerIndex, 1);
        }
    }

    getPeerForSocket(socket) {
        var peerIndex = Math.floor(Math.random() * (this.peers.length));

        if (this.peers[peerIndex] !== socket) {
            return this.peers[peerIndex];
        }
    }

    middleware(req, res, next) {
        console.log('Middleware worked');

        //Return just clean app if browser do not support WebRTC
        var browser = useragent.parse(req.headers['user-agent']).browser.toLowerCase();
        if (!browsersAllowed[browser]) {
            next();
            return;
        }

        //Return what should return if asked for favicon
        if (req.path.indexOf('favicon.ico') !== -1) {
            next();
            return;
        }

        var peerAvailable = this.getPeerForSocket(req.socket);

        if (peerAvailable) {
            console.log('Sending thin client');
            res.send(new ViralThinClient(peerAvailable).getContent());
            res.end();
        } else {
            console.log('Sending real app + addition');
            res.__send = res.send;
            res.send = function (data) {
                data += new ViralClientAddition(req).getContent();
                inline(data, {compress: false, attribute: '*'}, function (err, html) {
                    res.__send(html);
                    res.end();
                });
            };

            next();
        }
    }
}

module.exports = ViralContainer;