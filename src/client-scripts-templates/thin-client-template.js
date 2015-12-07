var transportCreationTemplate = require('./transport-creation-template.js');

module.exports = function (recommendedPeerId) {
    return `<!DOCTYPE html>
    <html>

    ${transportCreationTemplate()}

    var recommendedPeerId = '${recommendedPeerId}';

    console.log('Requesting app from ' + recommendedPeerId);

    var receivedBodyChunks = [];
    var receivedHeadChunks = [];

    var bodyReceived = false;
    var headReceived = false;

    var allReceived = function() {
        if (bodyReceived && headReceived) {

            executeScripts(document.body);

            setTimeout(function(){
              executeScripts(document.head);
              var evt = document.createEvent('Event');
              evt.initEvent('load', false, false);
              window.dispatchEvent(evt);
            }, 300);

            /* Object.keys(window.ViralContainer.p2p._peers).forEach(function(peerId){
             var peer = window.ViralContainer.p2p._peers[peerId];
             peer.destroy();
             }); */
        }
    }

    var p2p = window.ViralContainer.p2p = new P2P(window.ViralContainer.socket, opts, function (data) {
        p2p.emit('getApp', recommendedPeerId);

        p2p.on('body', function(data){
            if (data !== 'end') {
                receivedBodyChunks.push(data);
            } else {
                p2p.off('body');
                console.log('Received body');
                bodyReceived = true;
                document.body.innerHTML = receivedBodyChunks.join('');
                allReceived();
            }
        });

        p2p.on('head', function(data){
            if (data !== 'end') {
                receivedHeadChunks.push(data);
            } else {
                p2p.off('head');
                console.log('Received head');
                headReceived = true;
                document.head.innerHTML = receivedHeadChunks.join('');
                allReceived();
            }
        });
    });

    window.addEventListener('beforeunload', function(){
        window.ViralContainer.socket.disconnect();
    });

    window.ViralContainer.p2p.useSockets = false;
    window.ViralContainer.p2p.upgrade();
    </script>
    <script>
    function executeScripts(body_el) {
        // Finds and executes scripts in a newly added element's body.
        // Needed since innerHTML does not run scripts.
        //
        // Argument body_el is an element in the dom.

        function nodeName(elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() ===
                name.toUpperCase();
        };

        function evalScript(elem) {
            var data = (elem.text || elem.textContent || elem.innerHTML || "" ),
                head = document.getElementsByTagName("head")[0] ||
                    document.documentElement,
                script = document.createElement("script");

            script.type = "text/javascript";
            try {
                // doesn't work on ie...
                script.appendChild(document.createTextNode(data));
            } catch(e) {
                // IE has funky script nodes
                script.text = data;
            }

            head.insertBefore(script, head.firstChild);
            //head.removeChild(script);
        };

        // main section of function
        var scripts = [],
            script,
            children_nodes = body_el.childNodes,
            child,
            i;

        for (i = 0; children_nodes[i]; i++) {
            child = children_nodes[i];
            if (nodeName(child, "script" ) &&
                (!child.type || child.type.toLowerCase() === "text/javascript")) {
                scripts.push(child);
            }
        }

        for (i = 0; scripts[i]; i++) {
            script = scripts[i];
            if (script.parentNode) {script.parentNode.removeChild(script);}
            evalScript(scripts[i]);
        }
    };
    </script>
    </html>`;
}