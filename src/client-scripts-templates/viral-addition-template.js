var transportCreationTemplate = require('./transport-creation-template.js');

module.exports = function (p2pScriptContent, ioScriptContent) {
    return `${transportCreationTemplate()}

    var headData = document.head.innerHTML;
    var bodyData = document.body.innerHTML;
    var metaData = '';

    var opts = {peerOpts: {trickle: true}, autoUpgrade: false};
    window.ViralContainer.p2p = window.ViralContainer.p2p || new P2P(window.ViralContainer.socket, opts);

    window.ViralContainer.p2p.useSockets = false;
    window.ViralContainer.p2p.upgrade();

    function sendData(data, name) {
        var chunkLength = 16000;
        var chunksNumber = Math.ceil(data.length / chunkLength);

        for (var i = 0; i < chunksNumber; i++) {
            var chunkStart = i * chunkLength;
            var chunkEnd = Math.min((i + 1) * chunkLength, data.length);
            var chunk = data.substring(chunkStart, chunkEnd);
            window.ViralContainer.p2p.emit(name, chunk);
        }

        window.ViralContainer.p2p.emit(name, 'end');
    }

    window.ViralContainer.p2p.on('getApp', function(data){
        if (data === window.ViralContainer.socket.id) {
            console.log('Sending app');
            sendData(metaData + headData, 'head');
            sendData(bodyData, 'body');
        }
    });

    window.onbeforeunload = function(){
        window.ViralContainer.socket.disconnect();
    };

    window.ViralContainer.writeMeta = function (metaObject) {
        var metaString = JSON.stringify(metaObject);
        metaData = '<script>window.ViralContainer = typeof window.ViralContainer !== "undefined" ? window.ViralContainer : {};window.ViralContainer.meta = ' + metaString + ';<//script>';
        metaData = metaData.replace(new RegExp('//', 'g'), '/');
    };

    window.ViralContainer.socket.emit('readyToSeed');

    </script>`;
};